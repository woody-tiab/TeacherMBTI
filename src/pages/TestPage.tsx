import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMBTITest } from '../hooks/useMBTITest';
import { MBTIQuestionOption, MBTIAnswer } from '../types/mbti';
import QuestionCard from '../components/question/QuestionCard';
import QuestionNavigation from '../components/question/QuestionNavigation';
import { secureJsonStorage } from '../utils/secureStorage';

interface TestPageProps {
  onNavigateToHome: () => void;
  onNavigateToResult: () => void;
}

const TestPage: React.FC<TestPageProps> = ({ onNavigateToHome: _unused, onNavigateToResult }) => { // eslint-disable-line @typescript-eslint/no-unused-vars
  const {
    testState,
    currentQuestion,
    isLoading,
    error,
    canGoNext,
    canGoPrev,
    isComplete,
    hasAnswerForCurrentQuestion,
    startTest,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    completeTest,
    getAnswerForQuestion,
    result
  } = useMBTITest();

  const [retryKey, setRetryKey] = useState(0);

  // 테스트 초기화
  useEffect(() => {
    try {
      // 보안 스토리지에서 상태 확인
      const savedState = secureJsonStorage.getItem('mbti-test-state');
      if (!savedState) {
        // 저장된 상태가 없으면 새로운 테스트 시작
        startTest();
      }
    } catch (err) {
      console.error('테스트 초기화 중 오류:', err);
    }
  }, [startTest]);

  // 결과가 생성되면 저장 후 결과 페이지로 이동
  useEffect(() => {
    if (result && testState.isComplete) {
      try {
        secureJsonStorage.setItem('mbtiTestResult', result);
        onNavigateToResult();
      } catch (error) {
        console.error('Failed to save result:', error);
      }
    }
  }, [result, testState.isComplete, onNavigateToResult]);

  const handleAnswerSelect = (option: MBTIQuestionOption) => {
    if (!currentQuestion) return;

    const answer: MBTIAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: option.id,
      value: option.value,
      dimension: currentQuestion.dimension
    };

    answerQuestion(answer);
  };

  const handleComplete = () => {
    completeTest();
  };

  const handleRetry = useCallback(() => {
    setRetryKey(prev => prev + 1);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div 
          className="text-center space-y-4"
          role="status"
          aria-live="polite"
        >
          <div 
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"
            aria-hidden="true"
          />
          <p className="text-gray-600">
            <span className="sr-only">로딩 중: </span>
            질문을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div 
          className="text-center space-y-4 max-w-md"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg 
              className="w-8 h-8 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">오류가 발생했습니다</h2>
          <p className="text-gray-600">
            <span className="sr-only">에러 메시지: </span>
            {error}
          </p>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="테스트 다시 시도"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div key={retryKey} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            교사 MBTI 수업 스타일 분석
          </h1>
          <p className="text-gray-600 md:text-lg break-korean">
            각 질문에 가장 적합한 답변을 선택해주세요
          </p>
        </motion.div>

        {/* 질문 카드 */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            {currentQuestion ? (
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                currentAnswer={getAnswerForQuestion(currentQuestion.id)}
                onAnswerSelect={handleAnswerSelect}
                questionNumber={testState.currentQuestionIndex + 1}
                totalQuestions={testState.totalQuestions}
              />
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-600">질문을 불러오는 중...</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* 네비게이션 */}
        <QuestionNavigation
          currentQuestionIndex={testState.currentQuestionIndex}
          totalQuestions={testState.totalQuestions}
          progress={testState.progress}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          hasAnswerForCurrentQuestion={hasAnswerForCurrentQuestion}
          onPrevious={prevQuestion}
          onNext={nextQuestion}
          onComplete={handleComplete}
          isComplete={isComplete}
          isLoading={isLoading}
          getAnswerForQuestion={getAnswerForQuestion}
        />
      </div>
    </div>
  );
};

export default TestPage; 