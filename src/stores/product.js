import { defineStore } from 'pinia'
import { productApi } from '@/api/modules/product'
import { ElMessage } from 'element-plus'

export const useProductStore = defineStore('product', {
  // 状态
  state: () => ({
    products: [], // 商品列表
    loading: false // 加载状态
  }),

  // 行动
  actions: {
    // 获取所有商品
    async fetchProducts() {
      try {
        this.loading = true
        const response = await productApi.getProducts()
        this.products = response.data
        return response.data
      } catch (error) {
        ElMessage.error('获取商品列表失败，请稍后重试')
        console.error('获取商品列表错误:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    // 添加商品
    async addProduct(productData) {
      try {
        this.loading = true
        const response = await productApi.addProduct(productData)
        // 重新获取商品列表以保证数据一致性
        await this.fetchProducts()
        ElMessage.success('商品添加成功')
        return response.data
      } catch (error) {
        ElMessage.error('添加商品失败，请稍后重试')
        console.error('添加商品错误:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    // 更新商品
    async updateProduct(id, productData) {
      try {
        this.loading = true
        const response = await productApi.updateProduct(id, productData)
        // 重新获取商品列表以保证数据一致性
        await this.fetchProducts()
        return response.data
      } catch (error) {
        ElMessage.error('更新商品失败，请稍后重试')
        console.error('更新商品错误:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    // 删除商品
    async deleteProduct(id) {
      try {
        this.loading = true
        await productApi.deleteProduct(id)
        // 重新获取商品列表以保证数据一致性
        await this.fetchProducts()
        ElMessage.success('商品删除成功')
        return true
      } catch (error) {
        ElMessage.error('删除商品失败，请稍后重试')
        console.error('删除商品错误:', error)
        return false
      } finally {
        this.loading = false
      }
    }
  }
})