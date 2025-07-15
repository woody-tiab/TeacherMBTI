import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Button, Card } from '../components/common';

const HomePage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [hasSavedTest, setHasSavedTest] = useState(false);
  const [savedProgress, setSavedProgress] = useState(0);
  const [refreshMessage, setRefreshMessage] = useState<{
    type: string;
    message: string;
    timestamp: number;
  } | null>(null);

  // 새로고침 메시지 처리
  useEffect(() => {
    try {
      const savedMessage = sessionStorage.getItem('refreshMessage');
      if (savedMessage) {
        const parsedMessage = JSON.parse(savedMessage);
        // 1분 이내의 메시지만 표시
        if (Date.now() - parsedMessage.timestamp < 60000) {
          setRefreshMessage(parsedMessage);
          
          // 메시지 표시 후 5초 후 자동 제거
          setTimeout(() => {
            setRefreshMessage(null);
          }, 5000);
        }
        
        // 메시지 처리 후 sessionStorage에서 제거
        sessionStorage.removeItem('refreshMessage');
      }
    } catch (error) {
      console.warn('새로고침 메시지 처리 중 오류:', error);
    }
  }, []);

  // 저장된 테스트 상태 확인
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mbti-test-state');
      if (saved) {
        const parsedState = JSON.parse(saved);
        const hasProgress = parsedState.answers?.length > 0 || parsedState.currentQuestionIndex > 0;
        if (hasProgress && !parsedState.isComplete) {
          setHasSavedTest(true);
          setSavedProgress(Math.round((parsedState.answers?.length || 0) / 24 * 100));
        }
      }
    } catch (error) {
      console.warn('저장된 테스트 상태를 확인할 수 없습니다:', error);
    }
  }, []);

  const handleNewTest = () => {
    try {
      console.log('새로운 테스트를 시작합니다.');
      // 새로운 테스트 시작 시 기존 상태 삭제
      localStorage.removeItem('mbti-test-state');
      localStorage.removeItem('mbtiTestResult');
      // 새로운 테스트 시작 플래그 설정
      sessionStorage.setItem('newTestStarted', 'true');
      // 상태 업데이트
      setHasSavedTest(false);
      setSavedProgress(0);
      // 네비게이션
      console.log('테스트 페이지로 이동합니다.');
      navigate('/test');
    } catch (err) {
      console.error('새로운 테스트 시작 중 오류:', err);
    }
  };

  const handleContinueTest = () => {
    try {
      console.log('저장된 테스트를 계속 진행합니다.');
      // 정상적인 네비게이션 플래그 설정
      sessionStorage.setItem('normalNavigation', 'true');
      navigate('/test');
    } catch (err) {
      console.error('테스트 계속하기 중 오류:', err);
    }
  };

  const handleStartTest = () => {
    try {
      console.log('새로운 테스트를 시작합니다.');
      // 새로운 테스트 시작 시 기존 상태 삭제
      localStorage.removeItem('mbti-test-state');
      localStorage.removeItem('mbtiTestResult');
      // 정상적인 네비게이션 플래그 설정
      sessionStorage.setItem('normalNavigation', 'true');
      // 상태 업데이트
      setHasSavedTest(false);
      setSavedProgress(0);
      navigate('/test');
    } catch (err) {
      console.error('테스트 시작 중 오류:', err);
    }
  };

  const handleCloseMessage = () => {
    setRefreshMessage(null);
  };

  return (
    <Layout showHeader={false} maxWidth="xl">
      <div className="space-y-8">
        {/* 새로고침 알림 메시지 */}
        <AnimatePresence>
          {refreshMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-800">
                      {refreshMessage.message}
                    </p>
                    {hasSavedTest && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          onClick={handleContinueTest}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                        >
                          이어서 진행
                        </button>
                        <button
                          onClick={handleNewTest}
                          className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors"
                        >
                          새로 시작
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleCloseMessage}
                    className="flex-shrink-0 text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 히어로 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card 
            title="교사 MBTI 수업 스타일 분석" 
            subtitle="당신만의 수업 스타일을 발견해보세요"
            hover
            className="text-center bg-gradient-to-br from-blue-50 to-indigo-100 border-0"
            titleClassName="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            <motion.p 
              className="text-gray-700 mb-8 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              24개의 교육 상황별 질문을 통해 당신의 수업 스타일을  
              <br className="hidden sm:block" />
              <span className="font-semibold text-indigo-600">16가지 MBTI 타입</span>으로 분석해드립니다.
            </motion.p>
            
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {hasSavedTest ? (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <p className="text-amber-800 font-medium">
                      🔄 진행 중인 테스트가 있습니다 ({savedProgress}% 완료)
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={handleContinueTest}
                      className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-green-500 to-blue-600"
                    >
                      📋 테스트 계속하기
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="lg"
                      onClick={handleNewTest}
                      className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      🆕 새로 시작하기
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleStartTest}
                  className="px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  🎯 테스트 시작하기
                </Button>
              )}
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="p-6 bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="text-2xl mb-3">📝</div>
                <div className="font-semibold text-blue-700 mb-2">24개 질문</div>
                <div className="text-sm text-gray-600">교육 현장의 다양한 상황을 다루는 실제적인 질문들</div>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-green-100">
                <div className="text-2xl mb-3">⏱️</div>
                <div className="font-semibold text-green-700 mb-2">10분 소요</div>
                <div className="text-sm text-gray-600">빠르고 간편한 진단으로 즉시 결과 확인</div>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-purple-100">
                <div className="text-2xl mb-3">🎨</div>
                <div className="font-semibold text-purple-700 mb-2">16가지 타입</div>
                <div className="text-sm text-gray-600">개인화된 수업 스타일과 교육 방법 제시</div>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* 특징 소개 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card title="이런 분들께 추천해요" className="bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">👩‍🏫</span>
                  </div>
                  <span className="text-gray-700">현직 교사 및 교육자</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">🎓</span>
                  </div>
                  <span className="text-gray-700">교육학과 학생 및 예비교사</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600">📚</span>
                  </div>
                  <span className="text-gray-700">학원 강사 및 교육 관련 종사자</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600">💡</span>
                  </div>
                  <span className="text-gray-700">자신의 교육 방식을 점검하고 싶은 분</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600">🔍</span>
                  </div>
                  <span className="text-gray-700">효과적인 수업 전략을 찾고 싶은 분</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600">🚀</span>
                  </div>
                  <span className="text-gray-700">교육 역량을 한 단계 업그레이드하고 싶은 분</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 mb-4">
                지금 바로 시작해서 당신만의 교육 스타일을 발견해보세요!
              </p>
              <Button 
                variant="outline" 
                onClick={handleStartTest}
                className="px-6 py-2"
              >
                테스트 바로 시작하기 →
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* 결과 예시 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <Card title="분석 결과 예시" subtitle="이런 결과를 받아보실 수 있어요">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(() => {
                // ExampleResult 인터페이스 정의
                interface ExampleResult {
                  type: string;
                  name: string;
                  color: string;
                  description: string;
                }

                const examples: ExampleResult[] = [
                  { type: 'ENFJ', name: '열정적인 멘토', color: 'bg-red-500', description: '학생들과의 소통을 중시하는 따뜻한 교사' },
                  { type: 'INTJ', name: '체계적인 전략가', color: 'bg-purple-500', description: '논리적이고 계획적인 수업을 진행하는 교사' },
                  { type: 'ESFP', name: '활발한 엔터테이너', color: 'bg-orange-500', description: '재미있고 역동적인 수업을 만드는 교사' },
                  { type: 'ISTJ', name: '신뢰할 수 있는 전문가', color: 'bg-blue-500', description: '꼼꼼하고 체계적인 지도를 하는 교사' }
                ];

                return examples.map((example, index) => (
                  <motion.div
                    key={example.type}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  >
                    <div className={`w-8 h-8 ${example.color} rounded-full flex items-center justify-center mb-2`}>
                      <span className="text-white text-xs font-bold">{example.type}</span>
                    </div>
                    <div className="font-semibold text-gray-800 mb-1">{example.name}</div>
                    <div className="text-xs text-gray-600 leading-relaxed">{example.description}</div>
                  </motion.div>
                ));
              })()}
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
});

export default HomePage; 