import { Router, Request, Response } from 'express'
import { authService } from '../services/authService.js'

export const authRouter = Router()

// Register
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, userType } = req.body
    
    // Validation
    if (!email || !password || !fullName || !userType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      })
    }
    
    if (!['landowner', 'buyer'].includes(userType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user type',
      })
    }
    
    const result = await authService.register({
      email,
      password,
      fullName,
      userType,
    })
    
    res.status(201).json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    })
  }
})

// Login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password required',
      })
    }
    
    const result = await authService.login({ email, password })
    
    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    })
  }
})

// Forgot password
authRouter.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email required',
      })
    }
    
    await authService.forgotPassword(email)
    
    // Always return success for security (don't reveal if email exists)
    res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process request',
    })
  }
})

// Reset password
authRouter.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Token and new password required',
      })
    }
    
    await authService.resetPassword(token, newPassword)
    
    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Password reset failed',
    })
  }
})


