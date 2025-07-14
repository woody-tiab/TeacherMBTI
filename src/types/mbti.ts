// MBTI 4가지 차원 정의
export enum MBTIDimension {
  EI = 'EI', // Extraversion vs Introversion
  SN = 'SN', // Sensing vs Intuition
  TF = 'TF', // Thinking vs Feeling
  JP = 'JP'  // Judging vs Perceiving
}

// 16가지 MBTI 타입 enum
export enum MBTIType {
  INTJ = 'INTJ',
  INTP = 'INTP',
  ENTJ = 'ENTJ',
  ENTP = 'ENTP',
  INFJ = 'INFJ',
  INFP = 'INFP',
  ENFJ = 'ENFJ',
  ENFP = 'ENFP',
  ISTJ = 'ISTJ',
  ISFJ = 'ISFJ',
  ESTJ = 'ESTJ',
  ESFJ = 'ESFJ',
  ISTP = 'ISTP',
  ISFP = 'ISFP',
  ESTP = 'ESTP',
  ESFP = 'ESFP'
}

// 질문 인터페이스
export interface MBTIQuestion {
  id: number;
  text: string;
  dimension: MBTIDimension;
  options: MBTIQuestionOption[];
  category: string; // 수업 상황 카테고리
}

// 질문 선택지 인터페이스
export interface MBTIQuestionOption {
  id: string;
  text: string;
  value: number; // -2 ~ +2 점수
  type: 'A' | 'B'; // A: 첫 번째 성향, B: 두 번째 성향
}

// 사용자 답변 인터페이스
export interface MBTIAnswer {
  questionId: number;
  selectedOptionId: string;
  value: number;
  dimension: MBTIDimension;
}

// MBTI 점수 계산 결과
export interface MBTIScore {
  E: number; // Extraversion
  I: number; // Introversion
  S: number; // Sensing
  N: number; // Intuition
  T: number; // Thinking
  F: number; // Feeling
  J: number; // Judging
  P: number; // Perceiving
}

// MBTI 결과 인터페이스
export interface MBTIResult {
  type: MBTIType;
  scores: MBTIScore;
  confidence: number; // 결과 신뢰도 (0-100%)
  percentages: {
    EI: number; // E vs I 백분율
    SN: number; // S vs N 백분율
    TF: number; // T vs F 백분율
    JP: number; // J vs P 백분율
  };
}

// MBTI 타입별 상세 정보
export interface MBTITypeInfo {
  type: MBTIType;
  nickname: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  teachingStyle: {
    overview: string;
    classroomManagement: string;
    instructionMethod: string;
    studentInteraction: string;
    assessment: string;
  };
  tips: string[];
  compatibleStudentTypes: string[];
  color: string; // 타입별 대표 색상
}

// 앱 전체 상태 관리 타입
export interface AppState {
  currentStep: 'welcome' | 'test' | 'result';
  testState: TestState;
  result: MBTIResult | null;
  isLoading: boolean;
  error: string | null;
}

// 테스트 진행 상태
export interface TestState {
  currentQuestionIndex: number;
  answers: MBTIAnswer[];
  totalQuestions: number;
  progress: number; // 0-100%
  isComplete: boolean;
}

// 테스트 진행 액션 타입
export interface TestAction {
  type: 'START_TEST' | 'ANSWER_QUESTION' | 'NEXT_QUESTION' | 'PREV_QUESTION' | 'COMPLETE_TEST' | 'RESET_TEST';
  payload?: {
    answer?: MBTIAnswer;
    questionIndex?: number;
  };
}

// 애니메이션 설정 타입
export interface AnimationConfig {
  duration: number;
  ease: string;
  delay?: number;
}

// 페이지 전환 방향
export type TransitionDirection = 'left' | 'right' | 'up' | 'down';

// 공유 옵션 타입
export interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

// 통계 데이터 타입
export interface StatisticsData {
  totalTests: number;
  typeDistribution: Record<MBTIType, number>;
  averageCompletionTime: number;
} 