import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom', // Use jsdom for React component testing
    globals: true, // Enable global APIs like `describe`, `it`, etc., without imports
    setupFiles: './test/setup.ts', // Updated path to setup file
    include: ['test/**/*.{test,spec}.{ts,tsx}'], // Updated to include test files in ./test/
    coverage: {
      provider: 'v8', // Use V8 for code coverage
      reporter: ['text', 'json', 'html'], // Coverage report formats
      exclude: ['node_modules', 'dist', 'build', 'test'], // Exclude test directory from coverage
    },
  },
});