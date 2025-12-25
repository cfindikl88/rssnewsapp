import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Cleanup after each test
afterEach(() => {
    cleanup()
    localStorage.clear()
})

// Mock localStorage if needed
global.localStorage = {
    getItem: (key) => {
        return global.localStorageData[key] || null
    },
    setItem: (key, value) => {
        return global.localStorageData[key] = value
    },
    removeItem: (key) => {
        delete global.localStorageData[key]
    },
    clear: () => {
        global.localStorageData = {}
    }
}

global.localStorageData = {}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    takeRecords() { return []; }
    unobserve() { }
};
