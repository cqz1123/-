import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/admin',
      component: () => import('@/views/Admin.vue'),
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/Dashboard.vue')
        },
        {
          path: 'products',
          component: () => import('@/views/Products.vue')
        },
        {
          path: 'transactions',
          component: () => import('@/views/Transactions.vue')
        },
        {
          path: '',
          redirect: 'dashboard'
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from) => {
  // 检查 localStorage 中是否存在 token
  const token = localStorage.getItem('inventory_token')
  
  // 如果访问管理后台且未登录，跳转到登录页
  if (to.path.startsWith('/admin') && !token) {
    return '/login'
  } 
  
  // 如果已登录且访问登录页，跳转到管理后台
  if (to.path === '/login' && token) {
    return '/admin'
  } 
  
  // 其他情况正常跳转
  return true
})

export default router
