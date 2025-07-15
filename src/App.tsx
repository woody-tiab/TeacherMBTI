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
    // 중복 실행 방지를 위한 플래그
    let hasProcessed = false;
    
    // 통합된 새로고침 감지 및 처리 함수
    const handleRefreshDetection = () => {
      if (hasProcessed) return;
      
      // 메인페이지가 아닌 경우에만 새로고침 감지 로직 실행
      if (location.pathname === '/') return;
      
      // 새로운 테스트 시작 플래그 확인 (정상적인 네비게이션인지 확인)
      const newTestStarted = sessionStorage.getItem('newTestStarted');
      if (newTestStarted) {
        sessionStorage.removeItem('newTestStarted');
        console.log('🎯 정상적인 테스트 시작, 새로고침 감지 건너뛰기');
        return;
      }
      
      let isRefresh = false;
      
      // Modern PerformanceNavigationTiming API 사용
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0];
        // 'reload' 타입이면 새로고침
        isRefresh = navEntry.type === 'reload';
      }
      
      // 성능 API가 지원되지 않는 경우 sessionStorage 대체 방법 사용
      if (!isRefresh) {
        const sessionKey = 'app-session-id';
        const currentSessionId = sessionStorage.getItem(sessionKey);
        
        if (!currentSessionId) {
          // 새로운 세션 시작 - 새로고침이 아님
          sessionStorage.setItem(sessionKey, Date.now().toString());
          isRefresh = false;
        } else {
          // 기존 세션이 있는 상태에서 페이지가 새로 로드된 경우
          // 페이지 로드 타입 확인 (새로고침인지 뒤로가기인지)
          const pageAccessedByReload = (
            (window.performance.navigation && window.performance.navigation.type === 1) ||
            (window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type === 'reload'
          );
          isRefresh = pageAccessedByReload;
        }
      }
      
      // 새로고침이 감지된 경우 atomic하게 처리
      if (isRefresh) {
        hasProcessed = true;
        console.log('🔄 새로고침 감지됨, 메인페이지로 리다이렉트');
        
        // 저장된 테스트 상태 확인 및 메시지 생성
        let message = '새로고침으로 인해 메인페이지로 이동했습니다.';
        const savedState = localStorage.getItem('mbti-test-state');
        
        if (savedState) {
          try {
            const parsedState = JSON.parse(savedState);
            const hasProgress = parsedState.answers?.length > 0 || parsedState.currentQuestionIndex > 0;
            
            if (hasProgress) {
              message = '새로고침으로 인해 메인페이지로 이동했습니다. 저장된 테스트 진행 상황이 있습니다.';
              console.log('📊 진행 중인 테스트가 있습니다. 메인페이지로 이동합니다.');
            }
          } catch (error) {
            console.warn('저장된 상태 분석 중 오류:', error);
          }
        }
        
        // 메시지 저장과 리다이렉트를 atomic하게 처리
        sessionStorage.setItem('refreshMessage', JSON.stringify({
          type: 'info',
          message,
          timestamp: Date.now()
        }));
        
        navigate('/', { replace: true });
      }
    };
    
    // 새로고침 감지 처리 실행
    handleRefreshDetection();
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