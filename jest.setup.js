import '@testing-library/jest-dom'

// Mock ResizeObserver because JSDOM doesn't support it
global.ResizeObserver = class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
}