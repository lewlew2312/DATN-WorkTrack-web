import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

// Khoi tao gia tri State cua 1 slice trong redux
const initialState = {
  currentActiveBoard: null
}

// Cac hanh dong goi API (bat dong bo) va cap nhat du lieu vao redux, dung Middleware createAsyncThunk di kem voi extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    //LUU Y: axios se tra ve ket qua qua property cua no la data
    return response.data
  }
)

// Khoi tao 1 slice trong kho luu tru - redux store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Noi xu ly du lieu dong bo
  reducers: {
    // Luu y: luon can cap ngoac nhon cho function trong reducer cho du code ben trong chi co 1 dong vi day la rule cua Redux
    updateCurrentActiveBoard: (state, action) => {
      // action.payload la chuan dat ten nhan du lieu dau vao cua reducer, o day se gan no cho 1 bien co nghia hon
      const board = action.payload

      // Xu ly du lieu neu can thiet
      // ...

      // Update lai du lieu cua currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  // ExtraReducers: noi xu ly du lieu bat dong bo
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload o day la response.data tra ve o tren
      let board = action.payload

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

      // Update lai du lieu cua currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

// Actions: La noi danh cho cac components ben duoi goi bang dispatch() toi no de cap nhat lai du lieu thong qua reducer (chay dong bo)
// Nhung actions nay duoc tao tu dong boi redux theo ten cua reducer
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selectors: La noi danh cho cac components ben duoi goi toi bang hook useSelector() de lay du lieu tu trong kho redux store de su dung
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// file ten la activeBoardSlice nhung se export 1 thu la reducer
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer