import bcrypt from 'bcrypt'
import { User } from '@terravue/shared'
import { inMemoryStore } from '../repositories/inMemoryStore.js'
import { generateToken } from '../utils/jwt.js'
import { validateEmail, validatePassword } from '@terravue/shared'

const SALT_ROUNDS = 10

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  userType: 'landowner' | 'buyer'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: Omit<User, 'password'>
}

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Validate email
    if (!validateEmail(data.email)) {
      throw new Error('Invalid email format')
    }
    
    // Validate password
    if (!validatePassword(data.password)) {
      throw new Error('Password must be at least 8 characters with letters and numbers')
    }
    
    // Check if email already exists
    const existingUser = inMemoryStore.getUserByEmail(data.email)
    if (existingUser) {
      throw new Error('Email already registered')
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)
    
    // Create user
    const user: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      userType: data.userType,
      createdAt: new Date(),
    }
    
    inMemoryStore.addUser(user)
    
    // Generate token
    const token = generateToken({
      id: user.id,
      userId: user.id,
      email: user.email,
      userType: user.userType,
    })
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user
    
    // Log mock email
    this.logEmailVerification(user.email)
    
    return {
      token,
      user: userWithoutPassword,
    }
  }
  
  async login(data: LoginRequest): Promise<AuthResponse> {
    // Find user
    const user = inMemoryStore.getUserByEmail(data.email)
    if (!user) {
      throw new Error('Invalid email or password')
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid email or password')
    }
    
    // Update last login
    inMemoryStore.updateUser(user.id, { lastLogin: new Date() })
    
    // Generate token
    const token = generateToken({
      id: user.id,
      userId: user.id,
      email: user.email,
      userType: user.userType,
    })
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user
    
    return {
      token,
      user: userWithoutPassword,
    }
  }
  
  async forgotPassword(email: string): Promise<void> {
    const user = inMemoryStore.getUserByEmail(email)
    if (!user) {
      // Don't reveal if email exists for security
      return
    }
    
    // Log mock password reset email
    this.logPasswordReset(email)
  }
  
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // In a real app, we'd verify the reset token
    // For MVP, we'll simulate this
    
    if (!validatePassword(newPassword)) {
      throw new Error('Password must be at least 8 characters with letters and numbers')
    }
    
    // Mock implementation - would need to track reset tokens
    console.log('Password reset would be processed here')
  }
  
  private logEmailVerification(email: string): void {
    console.log(`
=== MOCK EMAIL: EMAIL VERIFICATION ===
To: ${email}
Subject: Verify your Terravue account
Content: 
  Welcome to Terravue!
  
  Please click the link below to verify your email address:
  http://localhost:3000/verify-email?token=mock-verification-token
  
  This link will expire in 24 hours.
  
  Thank you for joining our carbon credit trading platform!
  
  Best regards,
  Terravue Team
======================================
`)
  }
  
  private logPasswordReset(email: string): void {
    console.log(`
=== MOCK EMAIL: PASSWORD RESET ===
To: ${email}
Subject: Reset your Terravue password
Content:
  We received a request to reset your password.
  
  Click the link below to reset your password:
  http://localhost:3000/reset-password?token=mock-reset-token
  
  This link will expire in 1 hour.
  
  If you didn't request this, please ignore this email.
  
  Best regards,
  Terravue Team
===================================
`)
  }
}

export const authService = new AuthService()


