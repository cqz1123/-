<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">库存管理系统</h1>
      <el-form 
        :model="loginForm" 
        :rules="rules" 
        ref="loginFormRef"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            @click="handleLogin"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api/modules/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  // 表单校验
  if (!loginFormRef.value) return
  
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        
        // 发送登录请求
        const response = await userApi.login()
        
        const users = response.data
        console.log('所有用户:', response.data)
        
        // 在客户端验证用户名和密码
        const user = users.find(u => 
          u.username === loginForm.username && u.password === loginForm.password
        )
        
        if (user) {
          // 登录成功
          const token = `token-${user.id}-${Date.now()}`
          
          // 存储 token 和用户信息
          userStore.setToken(token)
          userStore.setUser(user)
          
          // 跳转到管理后台
          ElMessage.success('登录成功')
          router.push('/admin/dashboard')
        } else {
          // 登录失败
          ElMessage.error('用户名或密码错误')
        }
      } catch (error) {
        ElMessage.error('登录失败，请稍后重试')
        console.error('登录错误:', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.login-form {
  width: 100%;
}

.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}
</style>