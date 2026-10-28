import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.{test,spec}.ts'],
  },
  resolve: {
    alias: {
      '@': import.meta.dirname ?? path.resolve('.'),
    },
  },
});
