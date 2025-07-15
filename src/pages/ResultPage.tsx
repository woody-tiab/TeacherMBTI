import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MBTIResult, MBTITypeInfo } from '../types/mbti';
import { getMBTITypeInfo } from '../data/results';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import ShareButton from '../components/common/ShareButton';
import ResultCard from '../components/result/ResultCard';
import TypeDescription from '../components/result/TypeDescription';
import TeachingStyleInfo from '../components/result/TeachingStyleInfo';
import ScoreChart from '../components/result/ScoreChart';

type SectionType = 'overview' | 'details' | 'style' | 'chart';

interface ToastState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ResultPageProps {
  onNavigateToHome: () => void;
  onNavigateToTest: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ onNavigateToHome: _unused, onNavigateToTest }) => { // eslint-disable-line @typescript-eslint/no-unused-vars
  
  // URL 파라미터에서 결과 정보를 가져오거나 localStorage에서 가져옵니다
  const getResultFromStorage = (): MBTIResult | null => {
    try {
      const stored = localStorage.getItem('mbtiTestResult');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const result = getResultFromStorage();
  
  const onRetakeTest = () => {
    localStorage.removeItem('mbtiTestResult');
    onNavigateToTest();
  };
  const [typeInfo, setTypeInfo] = useState<MBTITypeInfo | null>(null);
  const [currentSection, setCurrentSection] = useState<SectionType>('overview');
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'info'
  });

  useEffect(() => {
    if (result) {
      setTypeInfo(getMBTITypeInfo(result.type));
    }
  }, [result]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // 공유 성공 핸들러
  const handleShareSuccess = (message: string) => {
    showToast(message, 'success');
  };

  // 공유 실패 핸들러
  const handleShareError = (message: string) => {
    showToast(message, 'error');
  };

  const handleSaveResult = () => {
    try {
      const savedResult = {
        result,
        typeInfo,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem('mbti-test-result', JSON.stringify(savedResult));
      showToast('결과가 저장되었습니다!', 'success');
    } catch (error) {
      console.error('Failed to save result:', error);
      showToast('결과 저장에 실패했습니다.', 'error');
    }
  };

  if (!result || !typeInfo) {
    return (
      <Layout showHeader={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600">결과를 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const sections = [
    { id: 'overview' as SectionType, label: '개요', icon: '📊' },
    { id: 'details' as SectionType, label: '분석', icon: '📋' },
    { id: 'style' as SectionType, label: '스타일', icon: '🎯' },
    { id: 'chart' as SectionType, label: '성향', icon: '📈' }
  ];

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              교사 MBTI 분석 결과
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              당신의 교육 스타일과 성격 특성을 종합적으로 분석한 결과입니다
            </p>
          </motion.div>

          {/* 섹션 네비게이션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white rounded-full p-1.5 shadow-lg border border-gray-200 max-w-full overflow-x-auto">
              <div className="flex space-x-0.5 min-w-fit">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap flex items-center ${
                      currentSection === section.id
                        ? 'text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: currentSection === section.id ? typeInfo.color : 'transparent'
                    }}
                  >
                    <span className="mr-1">{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 메인 콘텐츠 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              {currentSection === 'overview' && (
                <ResultCard result={result} typeInfo={typeInfo} />
              )}
              {currentSection === 'details' && (
                <TypeDescription typeInfo={typeInfo} />
              )}
              {currentSection === 'style' && (
                <TeachingStyleInfo typeInfo={typeInfo} />
              )}
              {currentSection === 'chart' && (
                <ScoreChart result={result} typeColor={typeInfo.color} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* 액션 버튼들 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={onRetakeTest}
              className="flex items-center space-x-2 min-w-[200px]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>다시 테스트하기</span>
            </Button>

            <ShareButton
              result={result}
              typeInfo={typeInfo}
              onShareSuccess={handleShareSuccess}
              onShareError={handleShareError}
              variant="secondary"
              size="lg"
              className="min-w-[200px]"
            />

            <Button
              variant="outline"
              size="lg"
              onClick={handleSaveResult}
              className="flex items-center space-x-2 min-w-[200px]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>결과 저장하기</span>
            </Button>
          </motion.div>

          {/* 추가 정보 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="bg-white bg-opacity-80 rounded-lg p-6 max-w-2xl mx-auto border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💡 분석 결과 활용 팁
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                이 결과는 당신의 교육 스타일을 이해하는 도구입니다. 
                강점은 더욱 발전시키고, 개선점은 점진적으로 향상시켜 나가세요. 
                모든 MBTI 유형은 고유한 가치가 있으며, 다양성이 교육의 힘입니다.
              </p>
            </div>
          </motion.div>

          {/* 빠른 공유 아이콘 (모바일 친화적) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="fixed bottom-6 right-6 md:hidden z-40"
          >
            <ShareButton
              result={result}
              typeInfo={typeInfo}
              onShareSuccess={handleShareSuccess}
              onShareError={handleShareError}
              variant="icon-only"
              className="shadow-lg"
            />
          </motion.div>
        </div>
        
        {/* Toast 알림 */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    </Layout>
  );
};

export default ResultPage; 