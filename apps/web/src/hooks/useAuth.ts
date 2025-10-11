import { useAuthStore } from '../stores/authStore'

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  } = useAuthStore()
  
  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
    isLandowner: user?.userType === 'landowner',
    isBuyer: user?.userType === 'buyer',
  }
}


