import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme'
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

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App

