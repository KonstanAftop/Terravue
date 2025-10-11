import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('should render TerraVue title', () => {
    render(<App />)
    
    expect(screen.getByText('TerraVue')).toBeInTheDocument()
  })
  
  it('should show setup complete message', () => {
    render(<App />)
    
    expect(screen.getByText(/Frontend Setup Complete/i)).toBeInTheDocument()
  })
})


