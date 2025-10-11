import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AppLayout } from '../../../components/layout/AppLayout'

// Mock the Sidebar component
vi.mock('../../../components/layout/Sidebar', () => ({
  Sidebar: ({ mobileOpen, onDrawerToggle }: any) => (
    <div data-testid="sidebar-mock">
      Sidebar Mock - Mobile Open: {mobileOpen ? 'true' : 'false'}
    </div>
  ),
}))

// Mock auth store
vi.mock('../../../stores/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: '1',
      email: 'test@test.com',
      fullName: 'Test User',
      userType: 'landowner',
    },
    logout: vi.fn(),
  }),
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('AppLayout', () => {
  it('renders children content', () => {
    renderWithRouter(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders Sidebar component', () => {
    renderWithRouter(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    )
    expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument()
  })

  it('has proper layout structure', () => {
    const { container } = renderWithRouter(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    )
    const mainBox = container.querySelector('[component="main"]')
    expect(mainBox).toBeInTheDocument()
  })
})

