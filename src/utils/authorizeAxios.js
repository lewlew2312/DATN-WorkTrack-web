import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// Khoi tao 1 doi tuong Axios (authorizedAxiosInstance) de custom va cau hinh chung cho du an
const authorizedAxiosInstance = axios.create()
// Thoi gian cho toi da cua 1 request: de 10 phut
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: Se cho phep axios tu dong gui cookie trong moi request len BE (phuc vu cho viec luu JWT tokens (refresh & access) vao trong httpOnly Cookie cua trinh duyet)
authorizedAxiosInstance.defaults.withCredentials = true

// Cau hinh Interceptor (Bo danh chan vao giua moi Request & Response)
// Interceptor Request: Can thiep vao giua nhung request API
authorizedAxiosInstance.interceptors.request.use( (config) => {
  // Ky thuat chan spam click
  interceptorLoadingElements(true)

  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Interceptor Response: Can thiep vao giua nhung response nhan ve
authorizedAxiosInstance.interceptors.response.use( (response) => {
  // Ky thuat chan spam click
  interceptorLoadingElements(false)
  return response
},
(error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // Moi ma http status code nam ngoai khoang 200 - 299 se la error va roi vao day

  // Ky thuat chan spam click
  interceptorLoadingElements(false)

  // Xu ly tap trung phan hien thi thong bao loi tra ve tu moi API o day
  // console.log error ra la thay cau truc data dan toi message loi nhu duoi
  console.log(error)
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // Dung toastify de hien thi bat ke moi ma loi len man hinh - ngoai tru ma 410 - GONE phuc vu viec tu dong refresh lai token
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
}
)

export default authorizedAxiosInstance