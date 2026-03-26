<template>
  <div class="dashboard-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>仪表盘</h2>
    </div>

    <!-- 加载状态 -->
    <div v-loading="loading" element-loading-text="加载中..." class="loading-container">
      <!-- 关键指标卡片 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :xs="24" :sm="12" :md="6" class="stat-col">
          <el-card class="stat-card">
            <div class="stat-icon goods-icon">
              <el-icon><Goods /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ totalProducts }}</div>
              <div class="stat-label">总商品数</div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6" class="stat-col">
          <el-card class="stat-card">
            <div class="stat-icon money-icon">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ totalStockValue }}</div>
              <div class="stat-label">总库存价值</div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6" class="stat-col">
          <el-card class="stat-card warning-card">
            <div class="stat-icon warning-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ lowStockProducts.length }}</div>
              <div class="stat-label">低库存商品数</div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6" class="stat-col">
          <el-card class="stat-card">
            <div class="stat-icon document-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ totalTransactions }}</div>
              <div class="stat-label">总出入库次数</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 低库存商品列表 -->
      <div class="low-stock-section">
        <h3 class="section-title">低库存预警商品</h3>
        <el-table
          v-if="lowStockProducts.length > 0"
          :data="lowStockProducts"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column prop="name" label="商品名称" min-width="150" />
          <el-table-column prop="sku" label="SKU" width="120" />
          <el-table-column prop="stock" label="当前库存" width="100" sortable />
          <el-table-column prop="alertThreshold" label="预警阈值" width="100" />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleProcess(scope.row.id)">
                立即处理
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-else description="暂无低库存商品" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Goods, Money, Warning, Document } from '@element-plus/icons-vue'

// 导入 API
import { productApi } from '@/api/modules/product'
import { transactionApi } from '@/api/modules/transaction'

// 初始化
const router = useRouter()
const loading = ref(false)
const products = ref([])
const transactions = ref([])

// 计算关键指标
const totalProducts = computed(() => {
  return products.value.length
})

const totalStockValue = computed(() => {
  const value = products.value.reduce((sum, p) => sum + p.price * p.stock, 0)
  return `¥${value.toLocaleString()}`
})

const lowStockProducts = computed(() => {
  return products.value
    .filter(p => p.stock <= p.alertThreshold)
    .sort((a, b) => a.stock - b.stock) // 按库存量升序排列
})

const totalTransactions = computed(() => {
  return transactions.value.length
})

// 页面加载时获取数据
onMounted(async () => {
  await fetchData()
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 并行获取商品列表和交易记录
    const [productsResponse, transactionsResponse] = await Promise.all([
      productApi.getProducts(),
      transactionApi.getTransactions()
    ])
    
    products.value = productsResponse.data
    transactions.value = transactionsResponse.data
  } catch (error) {
    ElMessage.error('获取数据失败，请稍后重试')
    console.error('获取数据错误:', error)
  } finally {
    loading.value = false
  }
}

// 处理低库存商品
const handleProcess = (productId) => {
  // 跳转到商品管理页面
  router.push('/admin/products')
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.page-header {
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

.loading-container {
  min-height: 400px;
}

.stats-row {
  margin-bottom: 30px;
}

.stat-col {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.warning-card {
  border-left: 4px solid #f56c6c;
}

.stat-icon {
  font-size: 32px;
  margin-right: 20px;
  padding: 15px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.goods-icon {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

.money-icon {
  color: #67c23a;
  background-color: rgba(103, 194, 58, 0.1);
}

.warning-icon {
  color: #f56c6c;
  background-color: rgba(245, 108, 108, 0.1);
}

.document-icon {
  color: #e6a23c;
  background-color: rgba(230, 162, 60, 0.1);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.low-stock-section {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .stat-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .low-stock-section {
    padding: 15px;
  }
}
</style>