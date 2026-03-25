import request from '../request'

export const transactionApi = {
  // 获取交易记录，支持分页、排序、筛选参数
  getTransactions: (params) => {
    return request.get('/transactions-history', {
      params
    })
  },

  // 删除单条交易记录
  deleteTransaction: (id) => {
    return request.delete(`/transactions-history/${id}`)
  },

  // 添加交易记录（保留之前的功能）
  addTransaction: (data) => {
    return request.post('/transactions-history', data)
  },

  // 根据商品ID获取交易记录（可选）
  getTransactionsByProductId: (productId) => {
    return request.get('/transactions-history', {
      params: {
        productId
      }
    })
  }
}