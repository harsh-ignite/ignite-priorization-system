import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const username = ref<string | null>(null)
  const isLoggingIn = ref(false)
  const error = ref<string | null>(null)

  // Check if user is already authenticated (from sessionStorage)
  const initAuth = () => {
    const savedAuth = sessionStorage.getItem('auth')
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth)
        isAuthenticated.value = authData.isAuthenticated
        username.value = authData.username
      } catch (err) {
        console.error('Failed to parse auth data:', err)
        sessionStorage.removeItem('auth')
      }
    }
  }

  // Login function
  const login = async (usernameInput: string, password: string) => {
    isLoggingIn.value = true
    error.value = null

    try {
      // Query the auth_users table
      const { data, error: queryError } = await supabase
        .from('auth_users')
        .select('*')
        .eq('username', usernameInput)
        .eq('password_hash', password)
        .single()

      if (queryError || !data) {
        error.value = 'Invalid username or password'
        return false
      }

      // Authentication successful
      isAuthenticated.value = true
      username.value = data.username

      // Save to sessionStorage
      sessionStorage.setItem('auth', JSON.stringify({
        isAuthenticated: true,
        username: data.username
      }))

      return true
    } catch (err) {
      console.error('Login error:', err)
      error.value = 'Login failed. Please try again.'
      return false
    } finally {
      isLoggingIn.value = false
    }
  }

  // Logout function
  const logout = () => {
    isAuthenticated.value = false
    username.value = null
    sessionStorage.removeItem('auth')
  }

  // Initialize on store creation
  initAuth()

  return {
    isAuthenticated,
    username,
    isLoggingIn,
    error,
    login,
    logout
  }
})
