export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

//phia FE se tu tao 1 card dac biet: Placeholder Card, khong lien quan toi Backend, card nay se duoc an o giao dien UI nguoi dung, cau truc Id cua card nay co cau truc don gian va unique nhung phai day du, bao gom:_id, boardId, columnId, FE_PlaceholderCard va moi column chi co the toi da 1 Placeholder Card
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}
