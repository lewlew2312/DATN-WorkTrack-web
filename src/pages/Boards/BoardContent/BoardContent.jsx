import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  //closestCenter,
  pointerWithin,
  //rectIntersection,
  getFirstCollision
} from '@dnd-kit/core'
import { useEffect, useState, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {

  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  //yeu cau chuot di chuyen 10px moi goi event, fix truong hop click, ko keo tha, bi goi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  //Nhan giu 250ms va di chuyen chenh lech 500px moi kich hoat event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  // uu tien su dung ket hop 2 loai sensors mouse, touch de co trai nghiem tren mobile tot nhat
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  //cung 1 thoi diem chi co 1 phan tu dang duoc keo (column hoac card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  //diem va cham cuoi cung truoc do (xu ly thuat toan phat hien va cham)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  //tim 1 column theo cardId
  const findColumnByCardId = (cardId) => {
    //nen dung c.cards thay vi c.cardOrderIds vi o buoc handleDragOver se lam du lieu cho cards hoan chinh truoc roi moi tao ra cardOrderIds moi
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  //function chung xu ly viec cap nhat lai state trong truong hop di chuyem Card giua cac Cloumn khac nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      //tim vi tri index cua overCard trong column dich den (noi activeCard sap duoc tha)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      //Logic tinh toan "cardIndex moi" (tren or duoi cua overCard) lay chuan tu code thu vien dnd-kit
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      //clone mang orderedColumnState cu ra 1 cai moi de xu ly data roi return va cap nhat lai orderedColumnState moi
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      //nextActiveColumn: Column cu
      if (nextActiveColumn) {
        //xoa card o column cu luc keo card ra khoi no de sang column khac
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //them placeholder card neu column rong sau khi keo het card di
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        //cap nhat lai mang cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      //nextOverColumn: Column moi
      if (nextOverColumn) {
        //kiem tra card dang keo co ton tai o overColumn chua, neu co thi can xoa no truoc
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //doi voi truong hop DragEnd thi phai cap nhat lai chuan du lieu clolumnId trong card sau khi keo card giua 2 column khac nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        //Roi them card dang keo vao overColumn theo vi tri index moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        //xoa Placeholder card di neu no dang ton tai
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        //cap nhat lai mang cardOrderIds cho chuan du lieu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  //Trigger khi bat dau keo 1 phan tu
  const handleDragStart = (event) => {
    // console.log('handleDragEnd: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    //neu la keo card thi moi thuc hien hanh dong set gia tri OldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  // Trigger trong qua trinh keo
  const handleDragOver = (event) => {
    // Ko lam gi them neu dang keo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    //neu keo card thi xu ly them de co the keo card qua lai cac column khac
    // console.log('handleDragOver: ', event)
    const { active, over } = event
    //kiem tra neu ko ton tai active hoac over (keo linh tinh ra ngoai thi return de tranh loi, crash trang)
    if (!active || !over) return

    //active la card dang duoc keo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    //over la card dang tuong tac tren duoi voi card dang duoc keo
    const { id: overCardId } = over

    //tim 2 column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    //Neu ko ton tai 1 trong 2 column thi ko lam gi het, tranh crash trang
    if (!activeColumn || !overColumn) return

    //chi xay ra xu ly logic khi keo card qua 2 column khac nhau, con neu keo card trong cung 1 column ban dau thi ko lam gi
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  //Trigger khi ket thuc keo 1 phan tu -> tha phan tu do
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)

    const { active, over } = event
    //kiem tra neu ko ton tai active hoac over (keo linh tinh ra ngoai thi return de tranh loi, crash trang)
    if (!active || !over) return

    //Xu ly keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {

      //active la card dang duoc keo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      //over la card dang tuong tac tren duoi voi card dang duoc keo
      const { id: overCardId } = over

      //tim 2 column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      //Neu ko ton tai 1 trong 2 column thi ko lam gi het, tranh crash trang
      if (!activeColumn || !overColumn) return

      //keo card qua 2 column khac nhau, phai dung activeDragItemData.columnId hoac oldColumnWhenDraggingCard._id vi sau khi di qua onDragOver toi day la state cua card da bi cap nhat 1 lan
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        //Hanh dong keo tha card trong cung 1 column
        // lay vi tri cu (tu oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // lay vi tri moi (tu overColumn)
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        //Dung arrayMove vi keo card trong 1 column thi tuong tu voi logic keo cloumn trong 1 board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumns => {
          //clone mang orderedColumnState cu ra 1 cai moi de xu ly data roi return va cap nhat lai orderedColumnState moi
          const nextColumns = cloneDeep(prevColumns)
          //Tim toi column ma chung ta dang keo tha
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          //tra ve gia tri state moi chuan vi tri
          return nextColumns
        })
      }

    }

    //Xu ly keo tha column trong 1 boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //vi tri cu != vi tri moi sau khi keo tha
      if (active.id !== over.id) {
        // lay vi tri cu (tu active)
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // lay vi tri moi (tu over)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        //arrayMove de sap xep lai mang Column ban dau
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // 2 console.log de dugn de xu ly goi API
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumns: ', dndOrderedColumns)
        // console.log('dndOrderedColumnsIds: ', dndOrderedColumnsIds)
        // cap nhat lai state columns ban dau sau khi da keo tha
        setOrderedColumns(dndOrderedColumns)
      }
    }

    //Nhung du lieu sau khi keo tha luon phai dua ve null mac dinh ban dau
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  //hieu ung khi drop phan tu
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } }
    })
  }

  //custom lai thuat toan phat hien va cham, de tranh truong hop bug khi keo card giua 2 column gan canh nhau
  //args = arguments = cac doi so, tham so
  const collisionDetectionStrategy = useCallback((args) => {
    //truong hop keo column thi dung thuat toan closestCorners la chuan nhat
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    //tim  cac diem giao nhau giua card dang keo va cac card khac, column khac, tra ve 1 mang cac va cham
    const pointerIntersections = pointerWithin(args)

    //neu pointerIntersections la mang rong, return luon, ko lam gi het
    //fix bug flickering cua thu vien dnd-kit trong truong hop sau: keo tha 1 card co image cover lon va keo len phia tren cung, ra khoi khu vuc keo tha
    if (!pointerIntersections?.length) return

    //thuat toan phat hien va cham se tra ve 1 mang cac va cham o day (ko can buoc nay nua)
    // const intersections = !!pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)

    //tim overId dau tien trong dam pointerIntersections o tren
    let overId = getFirstCollision(pointerIntersections, 'id')

    if (overId) {
      //neu cai over la column thi se tim toi cardId gan nhat ben trong khu vuc va cham do dua vao thuat toan phat hien va cham closestCenter hoac closestCorners deu duoc, tuy nhien dung closestCenter muot ma hon
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        // console.log('overId before: ', overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
        // console.log('overId after: ', overId)
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    //neu overId la null thi tra ve mang rong - tranh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      //cam bien
      sensors={sensors}
      //thuat toan phat hien va cham, neu ko co thi card co hinh lon se ko keo qua column khac duoc vi luc nay no dang bi conflict giua card va column
      //update: neu chi dung closetCorners se co bug la khi keo card thi no se bi nhay lung tung giua 2 column khi card dang o gan vung canh cua 2 column va sai lech du lieu
      // collisionDetection={closestCorners}

      //tu custom nang cao thuat toan phat hien va cham
      collisionDetection={collisionDetectionStrategy}

      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.worktrackCustom.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
