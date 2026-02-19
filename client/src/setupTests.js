import '@testing-library/jest-dom'
import { server } from './mocks/server'
import { beforeAll, afterEach, afterAll } from 'vitest'

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))

// Reset handlers after each test to avoid test pollution
afterEach(() => server.resetHandlers())

// Close MSW server after all tests
afterAll(() => server.close())
