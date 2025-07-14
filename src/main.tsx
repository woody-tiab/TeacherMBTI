import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('📍 TeacherMBTI 앱 시작 중...')
console.log('🌍 현재 URL:', window.location.href)
console.log('📁 현재 경로:', window.location.pathname)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 