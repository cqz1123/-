<template>
  <div class="products-container">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2>商品管理</h2>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        新增商品
      </el-button>
    </div>

    <!-- 商品列表 -->
    <div class="products-list">
      <el-empty v-if="productStore.products.length === 0" description="暂无商品" />
      <ProductCard
        v-for="product in productStore.products"
        :key="product.id"
        :product="product"
        @on-in-stock="handleInStock"
        @on-out-stock="handleOutStock"
        @on-delete="handleDelete"
        @on-card-click="handleCardClick"
      />
    </div>

    <!-- 加载状态 -->
    <el-loading v-if="productStore.loading" fullscreen text="加载中..." />

    <!-- 新增商品对话框 -->
    <AddProductDialog
      v-model:visible="showAddDialog"
      @on-submit="handleAddProduct"
    />

    <!-- 出入库对话框 -->
    <StockDialog
      v-model:visible="showStockDialog"
      :product="currentProduct"
      :type="stockDialogType"
      @on-submit="handleStockSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 导入组件
import ProductCard from '@/components/ProductCard.vue'
import AddProductDialog from '@/components/AddProductDialog.vue'
import StockDialog from '@/components/StockDialog.vue'

// 导入 store 和 API
import { useProductStore } from '@/stores/product'
import { transactionApi } from '@/api/modules/transaction'

// 初始化
const router = useRouter()
const productStore = useProductStore()

// 对话框状态
const showAddDialog = ref(false)
const showStockDialog = ref(false)
const currentProduct = ref(null)
const stockDialogType = ref('in') // 'in' 表示入库，'out' 表示出库

// 页面加载时获取商品列表
onMounted(async () => {
  await productStore.fetchProducts()
})

// 处理卡片点击事件
const handleCardClick = (productId) => {
  // 跳转到商品详情页
  router.push({
    name: 'productDetail',
    params: { id: productId }
  })
}

// 处理新增商品
const handleAddProduct = async (productData) => {
  await productStore.addProduct(productData)
  showAddDialog.value = false
}

// 处理入库操作
const handleInStock = (product) => {
  currentProduct.value = product
  stockDialogType.value = 'in'
  showStockDialog.value = true
}

// 处理出库操作
const handleOutStock = (product) => {
  currentProduct.value = product
  stockDialogType.value = 'out'
  showStockDialog.value = true
}

// 处理出入库提交
const handleStockSubmit = async (stockData) => {
  try {
    // 计算新的库存数量
    const currentStock = currentProduct.value.stock
    const newStock = stockDialogType.value === 'in' 
      ? currentStock + stockData.quantity 
      : currentStock - stockData.quantity

    // 1. 更新商品库存
    await productStore.updateProduct(stockData.productId, { stock: newStock })

    // 2. 添加交易记录
    const transactionData = {
      productId: stockData.productId,
      type: stockData.type,
      quantity: stockData.quantity,
      remark: stockData.remark,
      date: new Date().toISOString()
    }
    await transactionApi.addTransaction(transactionData)

    // 关闭对话框
    showStockDialog.value = false
    ElMessage.success(`${stockDialogType.value === 'in' ? '入库' : '出库'}操作成功`)
  } catch (error) {
    ElMessage.error(`${stockDialogType.value === 'in' ? '入库' : '出库'}操作失败，请稍后重试`)
    console.error(`${stockDialogType.value === 'in' ? '入库' : '出库'}操作错误:`, error)
  }
}

// 处理删除商品
const handleDelete = (productId) => {
  ElMessageBox.confirm('确定要删除这个商品吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await productStore.deleteProduct(productId)
  }).catch(() => {
    // 取消删除
  })
}
</script>

<style scoped>
.products-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .products-container {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>