import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { appTheme, landingTheme } from './theme'
import { LoginPage } from './pages/Login'
import { DashboardPage } from './pages/Dashboard'
import { LandManagementPage } from './pages/LandManagement'
import { AddLandPage } from './pages/AddLand'
import { LandDetailPage } from './pages/LandDetail'
import { GlobalMapPage } from './pages/GlobalMap'
import { CarbonMarketPage } from './pages/CarbonMarket'
import { CreateCreditListingPage } from './pages/CreateCreditListing'
import { MyListingsPage } from './pages/MyListings'
import { TransactionHistoryPage } from './pages/TransactionHistory'
import { ProfilePage } from './pages/Profile'
import MarketAnalytics from './pages/MarketAnalytics'
import { InteractiveMapPage } from './pages/InteractiveMap'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { PublicRoute } from './components/auth/PublicRoute'
import { LandingPage } from './pages/Landing'

function App() {
  return (
    <BrowserRouter>
      <ThemedRoutes />
    </BrowserRouter>
  )
}

const ThemedRoutes = () => {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  return (
    <ThemeProvider theme={isLandingPage ? landingTheme : appTheme}>
      <CssBaseline />
      <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/land-management"
            element={
              <ProtectedRoute>
                <LandManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/land-management/add"
            element={
              <ProtectedRoute>
                <AddLandPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/land-management/:id"
            element={
              <ProtectedRoute>
                <LandDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/global-map"
            element={
              <ProtectedRoute>
                <GlobalMapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/carbon-market"
            element={
              <ProtectedRoute>
                <CarbonMarketPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-listing"
            element={
              <ProtectedRoute>
                <CreateCreditListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-listings"
            element={
              <ProtectedRoute>
                <MyListingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/market-analytics"
            element={
              <ProtectedRoute>
                <MarketAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interactive-map"
            element={
              <ProtectedRoute>
                <InteractiveMapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App

