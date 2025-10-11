import { create } from 'zustand'
import { User } from '@terravue/shared'
import { authService } from '../services/authService'

interface AuthState {
  user: Omit<User, 'password'> | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string, userType: 'landowner' | 'buyer') => Promise<void>
  logout: () => void
  checkAuth: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  token: authService.getToken(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.login({ email, password })
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      })
      throw error
    }
  },
  
  register: async (email, password, fullName, userType) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.register({ email, password, fullName, userType })
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false,
      })
      throw error
    }
  },
  
  logout: () => {
    authService.logout()
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    })
  },
  
  checkAuth: () => {
    const user = authService.getCurrentUser()
    const token = authService.getToken()
    set({
      user,
      token,
      isAuthenticated: authService.isAuthenticated(),
    })
  },
  
  clearError: () => set({ error: null }),
}))


