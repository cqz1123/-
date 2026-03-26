<template>
  <el-container class="admin-container">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar">
      <div class="logo">库存管理系统</div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        router
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/admin/products">
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/transactions">
          <el-icon><TrendCharts /></el-icon>
          <span>出入库记录</span>
        </el-menu-item>
        <el-menu-item index="logout" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          <span>退出登录</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 主内容区域 -->
    <el-container class="main-container">
      <!-- 顶部栏 -->
      <el-header class="header">
        <div class="user-info">
          <span>欢迎，管理员</span>
        </div>
      </el-header>
      
      <!-- 内容区域 -->
      <el-main class="content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HomeFilled, Goods, TrendCharts, SwitchButton } from '@element-plus/icons-vue'

// 导入 store
import { useUserStore } from '@/stores/user'
import { useProductStore } from '@/stores/product'
import { useTransactionStore } from '@/stores/transaction'

const router = useRouter()
const route = useRoute()

// 初始化 store
const userStore = useUserStore()
const productStore = useProductStore()
const transactionStore = useTransactionStore()

// 计算当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 处理退出登录
const handleLogout = () => {
  // 清空用户信息和 token
  userStore.logout()
  
  // 清空商品数据
  productStore.products = []
  
  // 清空交易记录数据
  transactionStore.transactions = []
  transactionStore.pagination.total = 0
  
  // 跳转到登录页面
  router.push('/login')
}
</script>

<style scoped>
.admin-container {
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  background-color: #001529;
  color: white;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  background-color: #001529;
  border-bottom: 1px solid #002140;
  color: white;
}

.sidebar-menu {
  flex: 1;
  background-color: #001529 !important;
  border-right: none !important;
}

.sidebar-menu .el-menu-item {
  color: rgba(255, 255, 255, 0.7);
  margin: 0 10px;
  border-radius: 4px;
}

.sidebar-menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #1890ff;
  color: white;
}

/* 控制图标大小 */
.sidebar-menu .el-menu-item .el-icon {
  font-size: 16px;
  margin-right: 8px;
}

.main-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.user-info {
  font-size: 14px;
  color: #333;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}
</style>