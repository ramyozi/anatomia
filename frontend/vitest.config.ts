import { defineConfig } from 'vitest/config'
import path from 'node:path'

// Vitest runs unit tests for pure logic (theme resolution, camera-fit
// maths). jsdom gives us ``window.matchMedia`` / ``document`` for the
// theme helpers. Component rendering is intentionally out of scope —
// these are fast, deterministic logic tests.
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    css: false,
  },
})
