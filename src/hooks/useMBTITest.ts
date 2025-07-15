import { useState, useCallback, useEffect, useMemo } from 'react';
import { TestState, MBTIAnswer, MBTIResult, MBTIQuestion } from '../types/mbti';
import { updateTestState, calculateMBTI, validateAnswers, calculateProgress } from '../utils/mbti';
import { questions } from '../data/questions';

interface UseMBTITestReturn {
  // 상태
  testState: TestState;
  result: MBTIResult | null;
  isLoading: boolean;
  error: string | null;
  currentQuestion: MBTIQuestion | null;
  
  // 액션
  startTest: () => void;
  answerQuestion: (answer: MBTIAnswer) => void;
  goToQuestion: (questionIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  completeTest: () => void;
  resetTest: () => void;
  
  // 유틸리티
  canGoNext: boolean;
  canGoPrev: boolean;
  isComplete: boolean;
  hasAnswerForCurrentQuestion: boolean;
  getAnswerForQuestion: (questionId: number) => MBTIAnswer | undefined;
}

const TOTAL_QUESTIONS = questions.length;
const STORAGE_KEY = 'mbti-test-state';

const initialTestState: TestState = {
  currentQuestionIndex: 0,
  answers: [],
  totalQuestions: TOTAL_QUESTIONS,
  progress: 0,
  isComplete: false
};

// localStorage에서 상태 불러오기
const loadTestState = (): TestState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedState = JSON.parse(saved);
      // 기본값과 병합하여 누락된 필드 보완
      return {
        ...initialTestState,
        ...parsedState,
        totalQuestions: TOTAL_QUESTIONS // 항상 최신 질문 수로 업데이트
      };
    }
  } catch (error) {
    console.warn('저장된 테스트 상태를 불러올 수 없습니다:', error);
  }
  return initialTestState;
};

// localStorage에 상태 저장하기
const saveTestState = (state: TestState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('테스트 상태를 저장할 수 없습니다:', error);
  }
};

export const useMBTITest = (): UseMBTITestReturn => {
  const [testState, setTestState] = useState<TestState>(() => loadTestState());
  const [result, setResult] = useState<MBTIResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 현재 질문 가져오기
  const currentQuestion = questions[testState.currentQuestionIndex] || null;

  // 현재 질문에 답변이 있는지 확인
  const hasAnswerForCurrentQuestion = testState.answers.some(
    answer => answer.questionId === currentQuestion?.id
  );

  // 특정 질문의 답변 가져오기
  const getAnswerForQuestion = useCallback((questionId: number): MBTIAnswer | undefined => {
    return testState.answers.find(answer => answer.questionId === questionId);
  }, [testState.answers]);

  // 네비게이션 가능 여부
  const canGoNext = testState.currentQuestionIndex < TOTAL_QUESTIONS - 1;
  const canGoPrev = testState.currentQuestionIndex > 0;
  
  // 각 질문에 대해 고유한 답변이 있는지 확인
  const isComplete = useMemo(() => {
    const uniqueQuestionIds = new Set(testState.answers.map(answer => answer.questionId));
    return uniqueQuestionIds.size === TOTAL_QUESTIONS;
  }, [testState.answers]);

  // 실시간 진행률 계산
  const currentProgress = useMemo(() => {
    const uniqueQuestionIds = new Set(testState.answers.map(answer => answer.questionId));
    return calculateProgress(uniqueQuestionIds.size, TOTAL_QUESTIONS);
  }, [testState.answers]);

  // testState에 실시간 진행률 적용
  const enhancedTestState = useMemo(() => ({
    ...testState,
    progress: currentProgress
  }), [testState, currentProgress]);

  // 테스트 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    saveTestState(enhancedTestState);
  }, [enhancedTestState]);

  // 테스트 시작
  const startTest = useCallback(() => {
    const newState = initialTestState;
    setTestState(newState);
    setResult(null);
    setError(null);
    saveTestState(newState);
  }, []);

  // 질문 답변
  const answerQuestion = useCallback((answer: MBTIAnswer) => {
    try {
      setError(null);
      const newTestState = updateTestState(testState, answer);
      setTestState(newTestState);
    } catch (err) {
      setError(err instanceof Error ? err.message : '답변 처리 중 오류가 발생했습니다.');
    }
  }, [testState]);

  // 특정 질문으로 이동
  const goToQuestion = useCallback((questionIndex: number) => {
    if (questionIndex >= 0 && questionIndex < TOTAL_QUESTIONS) {
      setTestState(prev => ({
        ...prev,
        currentQuestionIndex: questionIndex
      }));
    }
  }, []);

  // 다음 질문으로 이동
  const nextQuestion = useCallback(() => {
    if (canGoNext) {
      setTestState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  }, [canGoNext]);

  // 이전 질문으로 이동
  const prevQuestion = useCallback(() => {
    if (canGoPrev) {
      setTestState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  }, [canGoPrev]);

  // 테스트 완료
  const completeTest = useCallback(async () => {
    if (!isComplete) {
      setError('모든 질문에 답변해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 답변 검증
      const validation = validateAnswers(testState.answers);
      if (!validation.isValid) {
        throw new Error(`답변이 유효하지 않습니다: ${validation.errors.join(', ')}`);
      }

      // MBTI 결과 계산
      const calculatedResult = calculateMBTI(testState.answers);
      setResult(calculatedResult);
      
      // 완료 상태 업데이트
      setTestState(prev => ({
        ...prev,
        isComplete: true
      }));

      // 테스트 완료 후 저장된 상태 제거
      localStorage.removeItem(STORAGE_KEY);

    } catch (err) {
      setError(err instanceof Error ? err.message : '결과 계산 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [testState.answers, isComplete]);

  // 테스트 초기화
  const resetTest = useCallback(() => {
    const newState = initialTestState;
    setTestState(newState);
    setResult(null);
    setError(null);
    setIsLoading(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // 테스트 완료 시 자동으로 결과 계산
  useEffect(() => {
    if (isComplete && !result && !isLoading) {
      completeTest();
    }
  }, [isComplete, result, isLoading, completeTest]);

  return {
    // 상태
    testState: enhancedTestState,
    result,
    isLoading,
    error,
    currentQuestion,
    
    // 액션
    startTest,
    answerQuestion,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    completeTest,
    resetTest,
    
    // 유틸리티
    canGoNext,
    canGoPrev,
    isComplete,
    hasAnswerForCurrentQuestion,
    getAnswerForQuestion
  };
}; 