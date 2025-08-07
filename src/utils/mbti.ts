import { 
  MBTIAnswer, 
  MBTIResult, 
  MBTIScore, 
  MBTIType, 
  MBTIDimension,
  MBTITypeInfo,
  TestState 
} from '../types/mbti';
import { questions, TOTAL_QUESTIONS } from '../data/questions';
import { getMBTITypeInfo } from '../data/results';

/**
 * 사용자 답변을 바탕으로 MBTI 타입을 계산하는 핵심 함수
 * @param answers 사용자의 모든 답변 배열
 * @returns MBTI 계산 결과
 */
export const calculateMBTI = (answers: MBTIAnswer[]): MBTIResult => {
  // 1. 각 차원별 점수 초기화
  const scores: MBTIScore = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };

  // 2. 답변별로 점수 집계
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;

    const selectedOption = question.options.find(opt => opt.id === answer.selectedOptionId);
    if (!selectedOption) return;

    // 각 차원별로 점수 할당
    switch (answer.dimension) {
      case MBTIDimension.EI:
        if (selectedOption.type === 'A') {
          scores.E += Math.abs(selectedOption.value);
        } else {
          scores.I += Math.abs(selectedOption.value);
        }
        break;
      
      case MBTIDimension.SN:
        if (selectedOption.type === 'A') {
          scores.S += Math.abs(selectedOption.value);
        } else {
          scores.N += Math.abs(selectedOption.value);
        }
        break;
      
      case MBTIDimension.TF:
        if (selectedOption.type === 'A') {
          scores.T += Math.abs(selectedOption.value);
        } else {
          scores.F += Math.abs(selectedOption.value);
        }
        break;
      
      case MBTIDimension.JP:
        if (selectedOption.type === 'A') {
          scores.J += Math.abs(selectedOption.value);
        } else {
          scores.P += Math.abs(selectedOption.value);
        }
        break;
    }
  });

  // 3. 각 차원별 최종 성향 결정
  const typeChars = [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N', 
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P'
  ];

  const finalType = typeChars.join('') as MBTIType;

  // 4. 각 차원별 백분율 계산
  const percentages = {
    EI: calculatePercentage(scores.E, scores.I),
    SN: calculatePercentage(scores.S, scores.N),
    TF: calculatePercentage(scores.T, scores.F),
    JP: calculatePercentage(scores.J, scores.P)
  };

  // 5. 결과 신뢰도 계산 (각 차원별 점수 차이의 평균)
  const confidence = calculateConfidence(percentages);

  return {
    type: finalType,
    scores,
    confidence,
    percentages
  };
};

/**
 * 두 점수 간의 백분율을 계산
 * @param scoreA 첫 번째 성향 점수
 * @param scoreB 두 번째 성향 점수
 * @returns A 성향의 백분율 (0-100)
 */
const calculatePercentage = (scoreA: number, scoreB: number): number => {
  const total = scoreA + scoreB;
  if (total === 0) return 50; // 동점인 경우 50%
  return Math.round((scoreA / total) * 100);
};

/**
 * 결과의 신뢰도를 계산
 * @param percentages 각 차원별 백분율
 * @returns 신뢰도 (0-100)
 */
const calculateConfidence = (percentages: {EI: number, SN: number, TF: number, JP: number}): number => {
  // 각 차원에서 50%에서 얼마나 떨어져 있는지 계산
  const deviations = [
    Math.abs(percentages.EI - 50),
    Math.abs(percentages.SN - 50),
    Math.abs(percentages.TF - 50),
    Math.abs(percentages.JP - 50)
  ];

  // 평균 편차를 신뢰도로 변환 (편차가 클수록 신뢰도 높음)
  const avgDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / 4;
  return Math.min(Math.round(50 + avgDeviation), 100);
};

/**
 * 테스트 진행률을 계산
 * @param answeredCount 답변한 문항 수
 * @param totalQuestions 전체 질문 수
 * @returns 진행률 (0-100)
 */
export const calculateProgress = (answeredCount: number, totalQuestions: number = TOTAL_QUESTIONS): number => {
  if (totalQuestions === 0) return 0;
  return Math.round((answeredCount / totalQuestions) * 100);
};

/**
 * 답변 데이터의 유효성을 검증
 * @param answers 검증할 답변 배열
 * @returns 검증 결과 객체
 */
export const validateAnswers = (answers: MBTIAnswer[]): {
  isValid: boolean;
  errors: string[];
  missingQuestions: number[];
} => {
  const errors: string[] = [];
  const missingQuestions: number[] = [];

  // 1. 모든 질문에 대한 답변이 있는지 확인
  const answeredQuestionIds = new Set(answers.map(a => a.questionId));
  
  for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
    if (!answeredQuestionIds.has(i)) {
      missingQuestions.push(i);
    }
  }

  if (missingQuestions.length > 0) {
    errors.push(`미답변 질문: ${missingQuestions.join(', ')}`);
  }

  // 2. 각 답변의 유효성 검증
  answers.forEach((answer, index) => {
    // 질문 ID 유효성
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) {
      errors.push(`답변 ${index + 1}: 유효하지 않은 질문 ID (${answer.questionId})`);
      return;
    }

    // 선택지 ID 유효성
    const selectedOption = question.options.find(opt => opt.id === answer.selectedOptionId);
    if (!selectedOption) {
      errors.push(`답변 ${index + 1}: 유효하지 않은 선택지 ID (${answer.selectedOptionId})`);
      return;
    }

    // 값 일치성 검증
    if (answer.value !== selectedOption.value) {
      errors.push(`답변 ${index + 1}: 값 불일치 (예상: ${selectedOption.value}, 실제: ${answer.value})`);
    }

    // 차원 일치성 검증
    if (answer.dimension !== question.dimension) {
      errors.push(`답변 ${index + 1}: 차원 불일치 (예상: ${question.dimension}, 실제: ${answer.dimension})`);
    }
  });

  // 3. 각 차원별 최소 답변 수 확인 (각 차원당 최소 1개)
  const dimensionCounts = {
    [MBTIDimension.EI]: 0,
    [MBTIDimension.SN]: 0,
    [MBTIDimension.TF]: 0,
    [MBTIDimension.JP]: 0
  };

  answers.forEach(answer => {
    dimensionCounts[answer.dimension]++;
  });

  Object.entries(dimensionCounts).forEach(([dimension, count]) => {
    if (count === 0) {
      errors.push(`${dimension} 차원에 대한 답변이 없습니다`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    missingQuestions
  };
};

/**
 * MBTI 타입에 대한 상세 설명을 반환
 * @param type MBTI 타입
 * @returns 타입 정보 객체
 */
export const getResultDescription = (type: MBTIType): MBTITypeInfo => {
  return getMBTITypeInfo(type);
};

/**
 * 테스트 상태를 업데이트하는 헬퍼 함수
 * @param currentState 현재 테스트 상태
 * @param newAnswer 새로운 답변
 * @returns 업데이트된 테스트 상태
 */
export const updateTestState = (currentState: TestState, newAnswer: MBTIAnswer): TestState => {
  // 기존 답변에서 같은 질문에 대한 답변이 있었는지 확인
  const wasAnswered = hasAnswerForQuestion(currentState.answers, newAnswer.questionId);

  // 기존 답변에서 같은 질문에 대한 답변 제거
  const filteredAnswers = currentState.answers.filter(
    answer => answer.questionId !== newAnswer.questionId
  );

  // 새로운 답변 추가
  const updatedAnswers = [...filteredAnswers, newAnswer];

  // 진행률 계산
  const progress = calculateProgress(updatedAnswers.length, TOTAL_QUESTIONS);

  // 완료 여부 확인
  const isComplete = updatedAnswers.length === TOTAL_QUESTIONS;

  // 새로운 질문에 답하는 경우에만 인덱스 증가
  const nextQuestionIndex = wasAnswered 
    ? currentState.currentQuestionIndex 
    : Math.min(currentState.currentQuestionIndex + 1, TOTAL_QUESTIONS - 1);

  return {
    ...currentState,
    answers: updatedAnswers,
    progress,
    isComplete,
    currentQuestionIndex: nextQuestionIndex
  };
};

/**
 * 특정 질문에 대한 답변이 있는지 확인
 * @param answers 답변 배열
 * @param questionId 질문 ID
 * @returns 답변 존재 여부
 */
export const hasAnswerForQuestion = (answers: MBTIAnswer[], questionId: number): boolean => {
  return answers.some(answer => answer.questionId === questionId);
};

/**
 * 특정 질문에 대한 답변을 가져옴
 * @param answers 답변 배열
 * @param questionId 질문 ID
 * @returns 답변 또는 undefined
 */
export const getAnswerForQuestion = (answers: MBTIAnswer[], questionId: number): MBTIAnswer | undefined => {
  return answers.find(answer => answer.questionId === questionId);
};

/**
 * 차원별 답변 통계를 계산
 * @param answers 답변 배열
 * @returns 차원별 통계
 */
export const calculateDimensionStats = (answers: MBTIAnswer[]): Record<MBTIDimension, {
  totalAnswers: number;
  averageValue: number;
  tendency: 'A' | 'B' | 'neutral';
}> => {
  const stats: Record<MBTIDimension, {
    totalAnswers: number;
    averageValue: number;
    tendency: 'A' | 'B' | 'neutral';
  }> = {
    [MBTIDimension.EI]: { totalAnswers: 0, averageValue: 0, tendency: 'neutral' },
    [MBTIDimension.SN]: { totalAnswers: 0, averageValue: 0, tendency: 'neutral' },
    [MBTIDimension.TF]: { totalAnswers: 0, averageValue: 0, tendency: 'neutral' },
    [MBTIDimension.JP]: { totalAnswers: 0, averageValue: 0, tendency: 'neutral' }
  };

  // 차원별로 답변 분류 및 통계 계산
  Object.values(MBTIDimension).forEach(dimension => {
    const dimensionAnswers = answers.filter(answer => answer.dimension === dimension);
    const totalAnswers = dimensionAnswers.length;
    
    if (totalAnswers === 0) {
      return;
    }

    const totalValue = dimensionAnswers.reduce((sum, answer) => sum + answer.value, 0);
    const averageValue = totalValue / totalAnswers;

    let tendency: 'A' | 'B' | 'neutral' = 'neutral';
    if (averageValue > 0.5) tendency = 'A';
    else if (averageValue < -0.5) tendency = 'B';

    stats[dimension] = {
      totalAnswers,
      averageValue,
      tendency
    };
  });

  return stats;
};

/**
 * MBTI 결과의 신뢰도에 따른 메시지를 반환
 * @param confidence 신뢰도 (0-100)
 * @returns 신뢰도 메시지
 */
export const getConfidenceMessage = (confidence: number): string => {
  if (confidence >= 90) {
    return "매우 높은 신뢰도의 결과입니다. 이 결과를 신뢰하셔도 좋습니다.";
  } else if (confidence >= 75) {
    return "높은 신뢰도의 결과입니다. 대부분의 특성이 일관되게 나타났습니다.";
  } else if (confidence >= 60) {
    return "보통 수준의 신뢰도입니다. 일부 영역에서 경계선상의 특성을 보일 수 있습니다.";
  } else if (confidence >= 40) {
    return "낮은 신뢰도의 결과입니다. 여러 타입의 특성을 고루 가지고 계실 수 있습니다.";
  } else {
    return "매우 낮은 신뢰도입니다. 추가적인 검사나 자기 성찰이 필요할 수 있습니다.";
  }
};

/**
 * 질문 순서를 무작위로 섞는 함수 (선택적 기능)
 * @param questionIds 질문 ID 배열
 * @returns 섞인 질문 ID 배열
 */
export const shuffleQuestions = (questionIds: number[]): number[] => {
  const shuffled = [...questionIds];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}; 