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
      ]
    }
  ]
})



export default router
