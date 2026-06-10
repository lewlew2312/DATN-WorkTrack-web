import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

//Cac function ben duoi chi request roi lay data luon, ma ko co try catch hay then catch gi de bat loi vi o FE ko can thiet phai lam vay doi vs moi request vi no gay ra viec du thua code catch loi qua nhieu
//Giai phap la se catch loi tap trung tai 1 noi bang cach tan dung Interceptors trong axios
// Interceptors la cach danh chan giua cac request hoac response de xu ly logic ma minh muon

// Boards
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  //LUU Y: axios se tra ve ket qua qua property cua no la data
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  //LUU Y: axios se tra ve ket qua qua property cua no la data
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

// Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  //LUU Y: axios se tra ve ket qua qua property cua no la data
  return response.data
}
