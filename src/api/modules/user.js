import request from '../request'

export const userApi = {
  // 登录请求
  login: () => {
    return request.get('/users')
  },
  
  // 获取所有用户
  getUsers: () => {
    return request.get('/users')
  }
}
