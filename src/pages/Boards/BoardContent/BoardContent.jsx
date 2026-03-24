import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

function BoardContent({ board }) {

  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  //yeu cau chuot di chuyen 10px moi goi event, fix truong hop click, ko keo tha, bi goi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  //Nhan giu 250ms va di chuyen chenh lech 500px moi kich hoat event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  // uu tien su dung ket hop 2 loai sensors mouse, touch de co trai nghiem tren mobile tot nhat
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    console.log('handleDragEnd: ', event)
    const { active, over } = event
    //kiem tra neu ko ton tai over (keo linh tinh ra ngoai thi return de tranh loi)
    if (!over) return
    //vi tri cu != vi tri moi sau khi keo tha
    if (active.id !== over.id) {
      // lay vi tri cu (tu active)
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // lay vi tri moi (tu over)
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      //arrayMove de sap xep lai mang Column ban dau
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // 2 console.log de dugn de xu ly goi API
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns: ', dndOrderedColumns)
      // console.log('dndOrderedColumnsIds: ', dndOrderedColumnsIds)
      // cap nhat lai state columns ban dau sau khi da keo tha
      setOrderedColumns(dndOrderedColumns)

    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.worktrackCustom.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
