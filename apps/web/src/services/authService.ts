import { api } from './api'
import { User } from '@terravue/shared'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  userType: 'landowner' | 'buyer'
}

export interface AuthResponse {
  token: string
  user: Omit<User, 'password'>
}

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', data)
    
    if (response.data.success) {
      // Store token and user info
      localStorage.setItem('auth_token', response.data.data.token)
      localStorage.setItem('auth_user', JSON.stringify(response.data.data.user))
      return response.data.data
    }
    
    throw new Error('Login failed')
  }
  
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data)
    
    if (response.data.success) {
      // Store token and user info
      localStorage.setItem('auth_token', response.data.data.token)
      localStorage.setItem('auth_user', JSON.stringify(response.data.data.user))
      return response.data.data
    }
    
    throw new Error('Registration failed')
  }
  
  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  }
  
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { token, newPassword })
  }
  
  logout(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }
  
  getCurrentUser(): Omit<User, 'password'> | null {
    const userStr = localStorage.getItem('auth_user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  }
  
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }
  
  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()


