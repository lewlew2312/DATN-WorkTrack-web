import { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent' // linh hoat neu cung cap thi dung ./, neu ../../ thi dung ~/
// import { mockData } from '~/apis/mock-data'
import Box from '@mui/material/Box'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

function Board() {
  const dispatch = useDispatch()
  // Khong dung state cua component nua ma chuyen qua dung State cua redux
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)

  const { boardId } = useParams()


  useEffect(() => {
    // Call API
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  // Goi API va xu ly khi keo tha Column xong xuoi
  // Chi can goi API de cap nhat mang columnOrderIds cua board co no (thay doi vi tri trong mang)
  const moveColumns = (dndOrderedColumns) => {
    // cap nhat lai cho chuan du lieu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    // Truong hop nay dung Spread Operator nay thi ko sao vi o day khong dun push nhu o tren lam thay doi truc tiep kieu mo rong mang, ma chi gan lai toan bo gia tri columns va columnOrderIds bang 2 mang moi
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Goi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  // Khi di chuyen card trong cung column: Chi can goi API de cap nhat mang cardOrderIds cua column co no (thay doi vi tri trong mang)
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // cap nhat lai cho chuan du lieu state Board

    // Cannot assign to read only property 'cards' of object
    // Truong hop Immutability o day da dung toi gia tri cards dang duoc coi la read only - (nested object - can thiep sau du lieu)
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))
    // Goi API update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })
  }

  // Khi di chuyen card sang column khac:
  // B1: Cap nhat lai mang cardOrderIds cua column ban dau chua no (Xoa _id cua card ra khoi mang)
  // B2: Cap nhat lai mang cardOrderIds cua column dich chua no (Them _id cua card vao mang)
  // B3: Cap nhat lai truong columnId moi cua card da keo
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // cap nhat lai cho chuan du lieu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    // Tuong tu dpan xu ly cho ham moveColumns ne khong anh huong redux toolkit Immutability gi o day ca
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Goi API xu ly BE
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    // Xu ly van de khi keo phan tu card cuoi cung ra khoi column, column rong se co placeholder card, can xoa di truoc khi gui du lieu ve phia BE
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vw'
      }}>
        <CircularProgress />
        <Typography>Loading Board ...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        // 3 truong hop move giu nguyen de code xu ly keo tha o phan BoardContent khong bi qua dai va mat kiem soat khi doc code
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
