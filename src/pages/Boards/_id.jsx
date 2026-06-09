import { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent' // linh hoat neu cung cap thi dung ./, neu ../../ thi dung ~/
// import { mockData } from '~/apis/mock-data'
import { mapOrder } from '~/utils/sorts'
import Box from '@mui/material/Box'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tam thoi fix cung boardId, flow chuan thi ve sau se su dung react-router-dom de lay boardId tu url
    const boardId = '6a144e0453a3d864b7b94634' //6a144e0453a3d864b7b94634
    // Call API
    fetchBoardDetailsAPI(boardId).then(board => {

      // Sap xep thu tu cac column o day trc khi dua du lieu truoc khi xuong cac component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // Khi f5 trang web, can xu ly van de keo tha vao 1 column rong
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sap xep thu tu cac card o day trc khi dua du lieu truoc khi xuong cac component con
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
  }, [])

  // Goi API tao moi Column va lam lai du lieu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    // Khi tao column moi no se chua co card, can xu ly van de keo tha vao 1 column rong
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    //Cap nhat state board
    // FE phai tu lam dung lai state data board (thay vi goi lai api fetchBoardDetailsAPI)
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // Goi API tao moi Card va lam lai du lieu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    //Cap nhat state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      // Neu column rong: ban chat la chua 1 cai placeholder card
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        // Nguoc lai column da co data thi push vao cuoi mang
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }

  // Goi API va xu ly khi keo tha Column xong xuoi
  // Chi can goi API de cap nhat mang columnOrderIds cua board co no (thay doi vi tri trong mang)
  const moveColumns = (dndOrderedColumns) => {
    // cap nhat lai cho chuan du lieu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Goi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  // Khi di chuyen card trong cung column: Chi can goi API de cap nhat mang cardOrderIds cua column co no (thay doi vi tri trong mang)
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // cap nhat lai cho chuan du lieu state Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    setBoard(newBoard)
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
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

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
        <CircularProgress/>
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
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
