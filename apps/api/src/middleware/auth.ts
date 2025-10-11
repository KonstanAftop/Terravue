import { Request, Response, NextFunction } from 'express'
import { verifyToken, JWTPayload } from '../utils/jwt.js'

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      })
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const payload = verifyToken(token)
    
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    })
  }
}

export const requireLandowner = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    })
  }
  
  if (req.user.userType !== 'landowner') {
    return res.status(403).json({
      success: false,
      error: 'Landowner access required',
    })
  }
  
  next()
}

export const requireBuyer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    })
  }
  
  if (req.user.userType !== 'buyer') {
    return res.status(403).json({
      success: false,
      error: 'Buyer access required',
    })
  }
  
  next()
}

// Alias for consistency
export const authMiddleware = authenticate


