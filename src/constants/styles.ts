// 공통 스타일 상수들
export const COMMON_STYLES = {
  // 배경 그라디언트
  GRADIENTS: {
    PRIMARY: 'bg-gradient-to-br from-blue-50 to-purple-50',
    CARD: 'bg-gradient-to-br from-blue-50 to-indigo-100', 
    SECONDARY: 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
  },
  
  // 공통 레이아웃
  LAYOUT: {
    SCREEN: 'min-h-screen',
    CONTAINER: 'container mx-auto px-4',
    CENTER: 'flex items-center justify-center'
  },
  
  // 카드 스타일
  CARDS: {
    DEFAULT: 'bg-white rounded-xl shadow-lg border border-gray-200',
    ELEVATED: 'bg-white rounded-xl shadow-xl border border-gray-100'
  },
  
  // 텍스트 스타일  
  TEXT: {
    TITLE: 'text-2xl md:text-3xl font-bold text-gray-900',
    SUBTITLE: 'text-base md:text-lg text-gray-600',
    BODY: 'text-sm md:text-base text-gray-700',
    KOREAN: 'break-korean word-break-keep-all'
  },
  
  // 버튼 크기
  BUTTON_SIZES: {
    SM: 'px-4 py-2 text-sm',
    MD: 'px-6 py-2.5 text-base', 
    LG: 'px-6 py-3 text-lg'
  },
  
  // 애니메이션
  TRANSITIONS: {
    DEFAULT: 'transition-all duration-200 ease-in-out',
    SLOW: 'transition-all duration-300 ease-in-out'
  }
} as const;

// 자주 사용되는 조합
export const STYLE_COMBINATIONS = {
  SCREEN_CENTER: `${COMMON_STYLES.LAYOUT.SCREEN} ${COMMON_STYLES.LAYOUT.CENTER}`,
  SCREEN_GRADIENT: `${COMMON_STYLES.LAYOUT.SCREEN} ${COMMON_STYLES.GRADIENTS.PRIMARY}`,
  CARD_DEFAULT: `${COMMON_STYLES.CARDS.DEFAULT} p-6`,
  TEXT_TITLE_KOREAN: `${COMMON_STYLES.TEXT.TITLE} ${COMMON_STYLES.TEXT.KOREAN}`
} as const;