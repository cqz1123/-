import { defineStore } from 'pinia'
import { transactionApi } from '@/api/modules/transaction'
import { ElMessage } from 'element-plus'

export const useTransactionStore = defineStore('transaction', {
  // 状态
  state: () => ({
    transactions: [], // 交易记录列表
    loading: false, // 加载状态
    pagination: {
      page: 1, // 当前页码
      limit: 10, // 每页数量
      total: 0 // 总记录数
    }
  }),

  // 行动
  actions: {
    // 获取交易记录
    async fetchTransactions(params = {}) {
      try {
        this.loading = true
        
        // 直接获取所有交易记录，传递筛选参数
        const response = await transactionApi.getTransactions(params)
        
        // 更新状态
        this.transactions = response.data
        
        // 更新总记录数
        this.pagination.total = response.data.length
        
        return response.data
      } catch (error) {
        ElMessage.error('获取交易记录失败，请稍后重试')
        console.error('获取交易记录错误:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    // 删除交易记录
    async deleteTransaction(id) {
      try {
        this.loading = true
        await transactionApi.deleteTransaction(id)
        
        // 从本地状态中移除删除的记录
        this.transactions = this.transactions.filter(transaction => transaction.id !== id)
        
        // 更新总记录数
        this.pagination.total--
        
        ElMessage.success('删除交易记录成功')
        return true
      } catch (error) {
        ElMessage.error('删除交易记录失败，请稍后重试')
        console.error('删除交易记录错误:', error)
        return false
      } finally {
        this.loading = false
      }
    }
  }
})