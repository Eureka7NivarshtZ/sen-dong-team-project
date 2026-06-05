import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
  // Thêm phần này để hỗ trợ biên dịch JSX đúng cách
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
});