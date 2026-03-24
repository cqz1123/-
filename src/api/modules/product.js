import request from '../request'

export const productApi = {
  // 获取所有商品
  getProducts: () => {
    return request.get('/products')
  },

  // 添加商品
  addProduct: (data) => {
    return request.post('/products', data)
  },

  // 更新商品
  updateProduct: (id, data) => {
    return request.patch(`/products/${id}`, data)
  },

  // 删除商品
  deleteProduct: (id) => {
    return request.delete(`/products/${id}`)
  }
}