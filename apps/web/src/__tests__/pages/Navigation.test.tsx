import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import App from '../../App'

// Mock all page components
vi.mock('../../pages/Dashboard', () => ({
  DashboardPage: () => <div>Dashboard Page</div>,
}))

vi.mock('../../pages/LandManagement', () => ({
  LandManagementPage: () => <div>Land Management Page</div>,
}))

vi.mock('../../pages/GlobalMap', () => ({
  GlobalMapPage: () => <div>Global Map Page</div>,
}))

vi.mock('../../pages/CarbonMarket', () => ({
  CarbonMarketPage: () => <div>Carbon Market Page</div>,
}))

vi.mock('../../pages/Profile', () => ({
  ProfilePage: () => <div>Profile Page</div>,
}))

vi.mock('../../pages/Login', () => ({
  LoginPage: () => <div>Login Page</div>,
}))

// Mock ProtectedRoute to render children
vi.mock('../../components/auth/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock auth store
vi.mock('../../stores/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: '1',
      email: 'test@test.com',
      fullName: 'Test User',
      userType: 'landowner',
      token: 'mock-token',
    },
    isAuthenticated: true,
    logout: vi.fn(),
  }),
}))

describe('Navigation Routing', () => {
  it('renders dashboard at /dashboard route', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
  })

  it('renders land management at /land-management route', () => {
    render(
      <MemoryRouter initialEntries={['/land-management']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Land Management Page')).toBeInTheDocument()
  })

  it('renders global map at /global-map route', () => {
    render(
      <MemoryRouter initialEntries={['/global-map']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Global Map Page')).toBeInTheDocument()
  })

  it('renders carbon market at /carbon-market route', () => {
    render(
      <MemoryRouter initialEntries={['/carbon-market']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Carbon Market Page')).toBeInTheDocument()
  })

  it('renders profile at /profile route', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Profile Page')).toBeInTheDocument()
  })

  it('renders login at /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('redirects root path to dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
  })
})

