import { Routes, Route, Navigate } from 'react-router-dom'

import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'

function App() {
  return (
    <Routes>
      {/*Redirect Route */}
      <Route path='/' element={
        // Can replace gia tri true o day de no thay the route /, co the hieu la route / se khong con nam trong history cua Browser
        // Co the thuc hanh bang cacg nhan Go home tu trang 404 xong quay lai bang nut back cua trinh duyet giua 2 truong hop co replace hoac khong co
        <Navigate to="/boards/6a144e0453a3d864b7b94634" replace={true}/>
      } />

      {/*Board Details */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/*Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />

      {/*404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
