import React, { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, ErrorBoundary, Loading } from './components/common';

// Lazy loading으로 페이지 컴포넌트들을 불러옵니다
const HomePage = React.lazy(() => import('./pages/HomePage'));
const TestPage = React.lazy(() => import('./pages/TestPage'));
const ResultPage = React.lazy(() => import('./pages/ResultPage'));

// 페이지 타입 정의
type PageType = 'home' | 'test' | 'result';

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

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  // 페이지 전환 함수
  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
  };

  // 현재 페이지에 따른 컴포넌트 렌더링
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onNavigateToTest={() => navigateToPage('test')}
            onNavigateToResult={() => navigateToPage('result')}
          />
        );
      case 'test':
        return (
          <TestPage 
            onNavigateToHome={() => navigateToPage('home')}
            onNavigateToResult={() => navigateToPage('result')}
          />
        );
      case 'result':
        return (
          <ResultPage 
            onNavigateToHome={() => navigateToPage('home')}
            onNavigateToTest={() => navigateToPage('test')}
          />
        );
      default:
        return (
          <HomePage 
            onNavigateToTest={() => navigateToPage('test')}
            onNavigateToResult={() => navigateToPage('result')}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navigation currentPage={currentPage} onNavigate={navigateToPage} />
        
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loading />
          </div>
        }>
          <AnimatePresence mode="wait">
            <PageWrapper key={currentPage}>
              {renderCurrentPage()}
            </PageWrapper>
          </AnimatePresence>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default App; 