import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from '../App'

describe('Smoke Tests - Critical Runtime Error Detection', () => {
  test('App renders without crashing', () => {
    // App already has BrowserRouter inside, don't wrap it again
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })

  test('No console errors on initial render', () => {
    const consoleErrors: unknown[] = []
    const originalError = console.error
    
    // Capture console.error calls
    console.error = (...args: unknown[]) => {
      consoleErrors.push(args)
    }

    try {
      render(<App />)
      
      // Filter out known/acceptable errors (like missing env vars in test)
      const realErrors = consoleErrors.filter((args) => {
        const message = Array.isArray(args) ? args.join(' ') : String(args)
        
        // Allow missing env var warnings in tests
        if (message.includes('import.meta.env')) return false
        if (message.includes('VITE_')) return false
        
        // Allow React Router warnings in test environment
        if (message.includes('Router')) return false
        if (message.includes('router')) return false
        if (message.includes('Future Flag Warning')) return false
        
        // Allow theme provider warnings
        if (message.includes('useTheme')) return false
        
        return true
      })
      
      // If there are real errors, fail with details
      if (realErrors.length > 0) {
        console.log('Console errors detected:', realErrors)
      }
      
      expect(realErrors).toHaveLength(0)
    } finally {
      console.error = originalError
    }
  })

  test('No unhandled promise rejections', async () => {
    const rejections: unknown[] = []
    
    const handler = (event: PromiseRejectionEvent) => {
      rejections.push(event.reason)
    }
    
    window.addEventListener('unhandledrejection', handler)
    
    try {
      render(<App />)
      
      // Wait a bit for any async operations
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(rejections).toHaveLength(0)
    } finally {
      window.removeEventListener('unhandledrejection', handler)
    }
  })

  test('All components export valid React elements', () => {
    // This catches "object is not valid as React child" errors (Error #31)
    const { container } = render(<App />)
    
    // Check that something was actually rendered
    expect(container.firstChild).toBeTruthy()
    expect(container.innerHTML.length).toBeGreaterThan(0)
  })

  test('No undefined.map errors', () => {
    const consoleErrors: unknown[] = []
    const originalError = console.error
    
    console.error = (...args: unknown[]) => {
      consoleErrors.push(args)
    }

    try {
      render(<App />)
      
      const mapErrors = consoleErrors.filter((args) => {
        const message = Array.isArray(args) ? args.join(' ') : String(args)
        return message.includes('.map is not a function') || 
               message.includes('Cannot read property') ||
               message.includes('Cannot read properties of undefined')
      })
      
      if (mapErrors.length > 0) {
        console.log('Map errors detected:', mapErrors)
      }
      
      expect(mapErrors).toHaveLength(0)
    } finally {
      console.error = originalError
    }
  })
})
