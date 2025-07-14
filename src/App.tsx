import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, ErrorBoundary, Loading } from './components/common';

// Lazy loading으로 페이지 컴포넌트들을 불러옵니다
const HomePage = React.lazy(() => import('./pages/HomePage'));
const TestPage = React.lazy(() => import('./pages/TestPage'));
const ResultPage = React.lazy(() => import('./pages/ResultPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// 페이지 전환 애니메이션을 위한 래퍼 컴포넌트
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

// 라우트 애니메이션을 위한 컴포넌트
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" key={location.pathname}>
      <Routes>
        <Route 
          path="/" 
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          } 
        />
        <Route 
          path="/test" 
          element={
            <PageWrapper>
              <TestPage />
            </PageWrapper>
          } 
        />
        <Route 
          path="/result" 
          element={
            <PageWrapper>
              <ResultPage />
            </PageWrapper>
          } 
        />
        <Route 
          path="/404" 
          element={
            <PageWrapper>
              <NotFoundPage />
            </PageWrapper>
          } 
        />
        {/* 잘못된 경로는 404 페이지로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  console.log('🚀 App 컴포넌트 렌더링 시작')
  console.log('📍 Router basename:', '/TeacherMBTI')
  
  return (
    <ErrorBoundary>
      <Router basename="/TeacherMBTI">
        <div className="min-h-screen bg-gray-50">
          {/* 네비게이션 바 */}
          <Navigation />
          
          {/* 메인 콘텐츠 영역 */}
          <main className="pt-4">
            <Suspense 
              fallback={
                <Loading 
                  message="페이지를 불러오는 중입니다" 
                  size="lg" 
                  fullScreen 
                />
              }
            >
              <AnimatedRoutes />
            </Suspense>
          </main>
          
          {/* 푸터 */}
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 text-sm"
                >
                  <p className="mb-2">
                    🎯 교사 MBTI 수업 스타일 분석 &copy; 2024
                  </p>
                  <p className="text-xs text-gray-500">
                    당신만의 교육 스타일을 발견하고 더 나은 교사가 되어보세요
                  </p>
                </motion.div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App; 