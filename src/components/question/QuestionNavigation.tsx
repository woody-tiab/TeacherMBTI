import { motion } from 'framer-motion';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { MBTIAnswer } from '../../types/mbti';

interface QuestionNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  hasAnswerForCurrentQuestion: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  isComplete: boolean;
  isLoading: boolean;
  getAnswerForQuestion: (questionId: number) => MBTIAnswer | undefined;
}

// Helper function for calculating visible question indices
const getVisibleQuestionIndices = (currentIndex: number, totalQuestions: number): number[] => {
  const maxVisible = Math.min(5, totalQuestions);
  const indices: number[] = [];
  
  // 현재 인덱스를 중심으로 앞뒤 2개씩 표시
  let startIndex = Math.max(0, currentIndex - 2);
  const endIndex = Math.min(totalQuestions - 1, startIndex + maxVisible - 1);
  
  // 끝에서 시작점을 조정 (총 5개를 유지하기 위해)
  if (endIndex - startIndex + 1 < maxVisible) {
    startIndex = Math.max(0, endIndex - maxVisible + 1);
  }
  
  // 연속된 인덱스 생성 (중복 방지)
  for (let i = startIndex; i <= endIndex; i++) {
    indices.push(i);
  }
  
  return indices;
};

const QuestionNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  progress,
  canGoPrev,
  canGoNext,
  hasAnswerForCurrentQuestion,
  onPrevious,
  onNext,
  onComplete,
  isComplete,
  isLoading,
  getAnswerForQuestion
}: QuestionNavigationProps) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const visibleQuestionIndices = getVisibleQuestionIndices(currentQuestionIndex, totalQuestions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* 진행률 바 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm md:text-base text-gray-600">
          <span>진행률</span>
          <span className="font-medium">{Math.round(progress)}% 완료</span>
        </div>
        <ProgressBar 
          progress={progress} 
          color="blue"
          showPercentage={false}
        />
      </div>

      {/* 질문 번호 표시 */}
      <div className="flex items-center justify-center space-x-2 mb-4" role="group" aria-label="질문 진행 상태">
        {visibleQuestionIndices.map((questionIndex) => {
          const isActive = questionIndex === currentQuestionIndex;
          // 실제 답변 여부 확인 (questionId는 1부터 시작)
          const isAnswered = getAnswerForQuestion(questionIndex + 1) !== undefined;
          
          let ariaLabel = `질문 ${questionIndex + 1}`;
          if (isActive) {
            ariaLabel += ' - 현재 질문';
          } else if (isAnswered) {
            ariaLabel += ' - 답변 완료';
          } else {
            ariaLabel += ' - 미답변';
          }
          
          return (
            <motion.div
              key={questionIndex}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm md:text-base font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-blue-500 text-white shadow-lg scale-110' 
                  : isAnswered 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              role="button"
              aria-label={ariaLabel}
              tabIndex={0}
            >
              {isAnswered ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              ) : (
                questionIndex + 1
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 네비게이션 버튼들 */}
      <div className="flex items-center justify-between gap-4">
        {/* 이전 버튼 */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onPrevious}
          disabled={!canGoPrev}
          className="flex items-center space-x-2 flex-1 sm:flex-none justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">이전</span>
        </Button>

        {/* 다음/완료 버튼 */}
        {isLastQuestion && isComplete ? (
          <Button
            variant="primary"
            size="lg"
            onClick={onComplete}
            disabled={isLoading}
            className="flex items-center space-x-2 flex-1 sm:flex-none justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">분석 중...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">결과 보기</span>
                <span className="sm:hidden">결과</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={onNext}
            disabled={!canGoNext || !hasAnswerForCurrentQuestion}
            className="flex items-center space-x-2 flex-1 sm:flex-none justify-center"
          >
            <span className="hidden sm:inline">다음</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        )}
      </div>

      {/* 도움말 텍스트 */}
      {!hasAnswerForCurrentQuestion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm md:text-base text-gray-500"
        >
          답변을 선택해주세요
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuestionNavigation; 