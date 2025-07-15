import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TeacherMBTI/', // GitHub Pages 배포를 위한 경로 설정
  
  // 빌드 최적화 설정
  build: {
    // 번들 크기 최적화
    rollupOptions: {
      output: {
        // 코드 스플리팅: vendor와 app 코드 분리
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-animation': ['framer-motion'],
          'vendor-utils': ['html2canvas']
        },
        // 청크 파일명 최적화
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      input: {
        main: 'index.html'
      }
    },
    // 파일 압축 설정
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 프로덕션에서 console.log 제거
        drop_debugger: true // 프로덕션에서 debugger 제거
      }
    },
    // 청크 크기 경고 임계값 설정
    chunkSizeWarningLimit: 1000,
    // 소스맵 설정 (배포시 false로 변경 가능)
    sourcemap: false
  },
  
  // 개발 서버 최적화
  server: {
    // 핫 리로드 최적화
    hmr: {
      overlay: false
    },
    // 포트 설정
    port: 3000,
    open: true
  },
  
  // 의존성 최적화
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion'
    ]
  },
  publicDir: 'public'
}) 