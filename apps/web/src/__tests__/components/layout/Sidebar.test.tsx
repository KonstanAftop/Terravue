import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from '../../../components/layout/Sidebar'

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/dashboard' }),
  }
})

// Mock auth store
const mockLogout = vi.fn()
vi.mock('../../../stores/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: '1',
      email: 'test@test.com',
      fullName: 'Test User',
      userType: 'landowner',
    },
    logout: mockLogout,
  }),
}))

// Mock useMediaQuery to always return false (desktop mode)
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material')
  return {
    ...actual,
    useMediaQuery: () => false,
  }
})

const renderSidebar = (mobileOpen = false, onDrawerToggle = vi.fn()) => {
  return render(
    <BrowserRouter>
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={onDrawerToggle} />
    </BrowserRouter>
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockLogout.mockClear()
  })

  it('renders Terravue logo and branding', () => {
    renderSidebar()
    expect(screen.getByText(/Terravue/i)).toBeInTheDocument()
    expect(screen.getByText(/Carbon Market Platform/i)).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    renderSidebar()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Land Management')).toBeInTheDocument()
    expect(screen.getByText('Global Map')).toBeInTheDocument()
    expect(screen.getByText('Carbon Market')).toBeInTheDocument()
    expect(screen.getByText('Profile & Activity')).toBeInTheDocument()
  })

  it('displays user information', () => {
    renderSidebar()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('Landowner')).toBeInTheDocument()
  })

  it('navigates to correct page when navigation item is clicked', () => {
    renderSidebar()
    const dashboardButton = screen.getByText('Dashboard').closest('button')
    if (dashboardButton) {
      fireEvent.click(dashboardButton)
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    }
  })

  it('shows logout confirmation dialog when logout is clicked', async () => {
    renderSidebar()
    const logoutButton = screen.getByText('Logout').closest('button')
    if (logoutButton) {
      fireEvent.click(logoutButton)
      await waitFor(() => {
        expect(screen.getByText('Confirm Logout')).toBeInTheDocument()
      })
    }
  })

  it('calls logout and navigates when logout is confirmed', async () => {
    renderSidebar()
    const logoutButton = screen.getByText('Logout').closest('button')
    if (logoutButton) {
      fireEvent.click(logoutButton)
      await waitFor(() => {
        expect(screen.getByText('Confirm Logout')).toBeInTheDocument()
      })
      
      const confirmButton = screen.getByRole('button', { name: /logout/i })
      fireEvent.click(confirmButton)
      
      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled()
        expect(mockNavigate).toHaveBeenCalledWith('/login')
      })
    }
  })

  it('does not logout when cancel is clicked', async () => {
    renderSidebar()
    const logoutButton = screen.getByText('Logout').closest('button')
    if (logoutButton) {
      fireEvent.click(logoutButton)
      await waitFor(() => {
        expect(screen.getByText('Confirm Logout')).toBeInTheDocument()
      })
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)
      
      await waitFor(() => {
        expect(mockLogout).not.toHaveBeenCalled()
      })
    }
  })
})

describe('Sidebar - Role-based visibility', () => {
  it('shows Land Management for landowner', () => {
    renderSidebar()
    expect(screen.getByText('Land Management')).toBeInTheDocument()
  })

  it('shows all common navigation items', () => {
    renderSidebar()
    // These should be visible for all user types
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Global Map')).toBeInTheDocument()
    expect(screen.getByText('Carbon Market')).toBeInTheDocument()
    expect(screen.getByText('Profile & Activity')).toBeInTheDocument()
  })
})

