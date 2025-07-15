import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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

// 새로고침 감지 및 리다이렉트 처리 컴포넌트
const RefreshHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // 메인페이지인 경우 앱 로드 플래그 설정
    if (location.pathname === '/') {
      sessionStorage.setItem('appLoaded', 'true');
      return;
    }
    
    // 정상적인 네비게이션 플래그 확인
    const normalNavigation = sessionStorage.getItem('normalNavigation');
    const appLoaded = sessionStorage.getItem('appLoaded');
    
    if (normalNavigation === 'true') {
      // 플래그 제거
      sessionStorage.removeItem('normalNavigation');
      console.log('🎯 정상적인 네비게이션 확인됨');
      return;
    }
    
    // 앱이 로드되지 않은 상태에서 서브 페이지에 접근 (새로고침 또는 직접 접근)
    if (!appLoaded) {
      console.log('🔄 새로고침 또는 직접 접근 감지됨, 현재 경로:', location.pathname);
      
      // 테스트 페이지에서 새로고침한 경우
      if (location.pathname === '/test') {
        const savedState = localStorage.getItem('mbti-test-state');
        
        if (savedState) {
          try {
            const parsedState = JSON.parse(savedState);
            const hasProgress = parsedState.answers?.length > 0 || parsedState.currentQuestionIndex > 0;
            
            if (hasProgress) {
              console.log('📊 진행 중인 테스트가 있습니다. 테스트 페이지를 유지합니다.');
              sessionStorage.setItem('appLoaded', 'true');
              return;
            }
          } catch (error) {
            console.warn('저장된 상태 분석 중 오류:', error);
          }
        }
      }
      
      // 결과 페이지에서 새로고침한 경우
      if (location.pathname === '/result') {
        const savedResult = localStorage.getItem('mbti-test-result');
        
        if (savedResult) {
          console.log('📊 저장된 결과가 있습니다. 결과 페이지를 유지합니다.');
          sessionStorage.setItem('appLoaded', 'true');
          return;
        }
      }
      
      // 그 외의 경우 메인페이지로 리다이렉트
      console.log('🏠 메인페이지로 리다이렉트');
      const message = '페이지를 새로고침하여 메인페이지로 이동했습니다.';
      
      sessionStorage.setItem('refreshMessage', JSON.stringify({
        type: 'info',
        message,
        timestamp: Date.now()
      }));
      
      navigate('/', { replace: true });
    } else {
      console.log('🎯 정상적인 상태 확인됨');
    }
  }, [location.pathname, navigate]);

  return null;
};

// 라우트 애니메이션을 위한 컴포넌트
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <>
      <RefreshHandler />
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
    </>
  );
};

const App: React.FC = () => {
  console.log('🚀 App 컴포넌트 렌더링 시작')
  
  // 개발 환경과 프로덕션 환경에 따라 basename 설정
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const basename = isLocalhost ? '' : '/TeacherMBTI';
  console.log('📍 Router basename:', basename)
  console.log('🌐 Current hostname:', window.location.hostname)
  
  return (
    <ErrorBoundary>
      <Router basename={basename}>
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
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App; 