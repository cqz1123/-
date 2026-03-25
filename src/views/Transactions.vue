<template>
  <div class="transactions-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>出入库记录</h2>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :model="filterForm" inline>
        <el-form-item label="商品名称">
          <el-select v-model="filterForm.productId" placeholder="请选择商品">
            <el-option label="全部" value="" />
            <el-option
              v-for="product in products"
              :key="product.id"
              :label="product.name"
              :value="product.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="filterForm.type" placeholder="请选择操作类型">
            <el-option label="全部" value="" />
            <el-option label="入库" value="in" />
            <el-option label="出库" value="out" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :shortcuts="dateShortcuts"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="exportCsv">导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 交易记录表格 -->
    <el-table
      v-loading="transactionStore.loading"
      :data="transactionsWithProductName"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column prop="productName" label="商品名称" min-width="180" />
      <el-table-column prop="type" label="操作类型" width="100">
        <template #default="scope">
          <el-tag
            :type="scope.row.type === 'in' ? 'success' : 'danger'"
          >
            {{ scope.row.type === 'in' ? '入库' : '出库' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" width="100" align="right" />
      <el-table-column prop="remark" label="备注" min-width="200">
        <template #default="scope">
          {{ scope.row.remark || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="date" label="操作时间" min-width="180" sortable>
        <template #default="scope">
          {{ formatDate(scope.row.date) }}
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="transactionStore.pagination.page"
        v-model:page-size="transactionStore.pagination.limit"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="transactionStore.pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 空状态 -->
    <el-empty v-if="!transactionStore.loading && transactionsWithProductName.length === 0" description="暂无交易记录" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

// 导入 store 和 API
import { useTransactionStore } from '@/stores/transaction'
import { useProductStore } from '@/stores/product'

// 初始化
const transactionStore = useTransactionStore()
const productStore = useProductStore()

// 商品列表
const products = ref([])

// 筛选表单
const filterForm = ref({
  productId: '',
  type: '',
  dateRange: []
})

// 日期快捷选项
const dateShortcuts = [
  {
    text: '今日',
    value: () => {
      const today = new Date()
      return [today, today]
    }
  },
  {
    text: '本周',
    value: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6)
      return [start, end]
    }
  },
  {
    text: '本月',
    value: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return [start, end]
    }
  }
]

// 计算交易记录与商品名称关联
  const transactionsWithProductName = computed(() => {
  // 确保 transactions 是数组
  const transactions = Array.isArray(transactionStore.transactions) ? transactionStore.transactions : []
  return transactions.map(transaction => {
    // 查找商品名称
    const product = products.value.find(p => p.id === transaction.productId)
    return {
      ...transaction,
      productName: product ? product.name : `已删除商品 (ID: ${transaction.productId})`
    }
  })
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 页面加载时获取数据
onMounted(async () => {
  // 获取商品列表
  await productStore.fetchProducts()
  products.value = productStore.products
  
  // 获取交易记录
  await transactionStore.fetchTransactions()
})

// 处理搜索
const handleSearch = async () => {
  // 构建筛选参数
  const params = {
    page: 1 // 重置到第一页
  }
  
  // 商品ID筛选
  if (filterForm.value.productId) {
    params.productId = filterForm.value.productId
  }
  
  // 操作类型筛选
  if (filterForm.value.type) {
    params.type = filterForm.value.type
  }
  
  // 时间范围筛选
  if (filterForm.value.dateRange && filterForm.value.dateRange.length === 2) {
    // 开始日期（包含）
    params['date_gte'] = new Date(filterForm.value.dateRange[0]).toISOString()
    // 结束日期（包含）
    const endDate = new Date(filterForm.value.dateRange[1])
    endDate.setHours(23, 59, 59, 999)
    params['date_lte'] = endDate.toISOString()
  }
  
  // 发送请求
  await transactionStore.fetchTransactions(params)
}

// 重置筛选
const resetFilter = async () => {
  // 清空筛选表单
  filterForm.value = {
    productId: '',
    type: '',
    dateRange: []
  }
  
  // 重新获取数据
  await transactionStore.fetchTransactions({ page: 1 })
}

// 处理分页大小变化
const handleSizeChange = async (size) => {
  await transactionStore.fetchTransactions({ limit: size, page: 1 })
}

// 处理分页当前页变化
const handleCurrentChange = async (current) => {
  await transactionStore.fetchTransactions({ page: current })
}

// 处理删除
const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除这条交易记录吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await transactionStore.deleteTransaction(id)
  }).catch(() => {
    // 取消删除
  })
}

// 导出为CSV
const exportCsv = () => {
  if (transactionsWithProductName.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  
  // 构建CSV内容
  const headers = ['商品名称', '操作类型', '数量', '备注', '操作时间']
  const rows = transactionsWithProductName.value.map(transaction => [
    transaction.productName,
    transaction.type === 'in' ? '入库' : '出库',
    transaction.quantity,
    transaction.remark || '',
    formatDate(transaction.date)
  ])
  
  // 组合CSV字符串
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  // 创建Blob对象
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  // 创建下载链接
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `出入库记录_${new Date().toISOString().slice(0, 10)}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.transactions-container {
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

.filter-section {
  background-color: white;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-section {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .transactions-container {
    padding: 10px;
  }
  
  .filter-section {
    padding: 12px;
  }
  
  .el-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .el-form-item {
    margin-right: 0 !important;
    margin-bottom: 12px !important;
  }
}
</style>