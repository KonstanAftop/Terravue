import { GeoCoordinate } from '../types/common.js'

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  // Minimum 8 characters, at least one letter and one number
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
}

export const validateIndonesianCoordinates = (coord: GeoCoordinate): boolean => {
  // Indonesia latitude range: approximately -11° to 6°
  // Indonesia longitude range: approximately 95° to 141°
  return (
    coord.lat >= -11 && 
    coord.lat <= 6 && 
    coord.lng >= 95 && 
    coord.lng <= 141
  )
}


