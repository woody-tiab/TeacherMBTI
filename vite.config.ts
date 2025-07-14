import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TeacherMBTI/', // GitHub Pages 배포를 위한 base path
}) 