import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('inventory_token') || ''
  }),
  
  actions: {
    setUser(user) {
      this.user = user
    },
    
    setToken(token) {
      this.token = token
      localStorage.setItem('inventory_token', token)
    },
    
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('inventory_token')
    }
  }
})