/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    include: ['app/__tests__/**/*.test.ts', 'app/__tests__/**/*.test.tsx'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts', 'app/tests/helpers/setup.ts'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
