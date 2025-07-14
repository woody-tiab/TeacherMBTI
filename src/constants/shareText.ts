export const SHARE_TEXT = {
  // 메인 공유 텍스트
  MAIN_SHARE_TITLE: '교사 MBTI 수업 스타일 분석',
  SHARE_BUTTON_LABEL: {
    WITH_WEB_SHARE: '공유하기',
    WITHOUT_WEB_SHARE: '결과 공유'
  },
  
  // 드롭다운 UI 텍스트
  DROPDOWN: {
    TITLE: '결과 공유하기',
    SUBTITLE: '다양한 방법으로 결과를 공유해보세요',
    CLOSE_LABEL: '닫기',
    MORE_OPTIONS_LABEL: '더 많은 공유 옵션'
  },
  
  // 빠른 액션 버튼들
  QUICK_ACTIONS: {
    COPY_LINK: {
      TITLE: '링크 복사',
      DESCRIPTION: '클립보드에 복사하기'
    },
    GENERATE_IMAGE: {
      TITLE: '이미지 저장',
      DESCRIPTION: '결과를 이미지로 다운로드'
    }
  },
  
  // 소셜 미디어 섹션
  SOCIAL_MEDIA: {
    TITLE: '소셜 미디어'
  },
  
  // 공유 메시지 템플릿
  SHARE_MESSAGE_TEMPLATE: (nickname: string, type: string) => 
    `🎯 교사 MBTI 분석 결과\n💼 저는 "${nickname}" 유형의 교사입니다!\n📊 MBTI 타입: ${type}`,
  
  // 성공/에러 메시지
  MESSAGES: {
    SUCCESS: {
      SHARE_COMPLETED: '공유가 완료되었습니다!',
      SHARE_CANCELLED: '공유가 취소되었습니다.',
      LINK_COPIED: '클립보드에 복사되었습니다!',
      IMAGE_DOWNLOADED: '결과 이미지가 다운로드되었습니다!',
      SOCIAL_SHARE: (platform: string) => `${platform}으로 공유 페이지가 열렸습니다.`
    },
    ERROR: {
      SHARE_FAILED: '공유에 실패했습니다.',
      COPY_FAILED: '복사에 실패했습니다.',
      IMAGE_GENERATION_FAILED: '이미지 생성에 실패했습니다.',
      IMAGE_ELEMENT_NOT_FOUND: '결과 영역을 찾을 수 없습니다.'
    }
  },
  
  // 이미지 파일명
  IMAGE_FILENAME: (type: string) => `교사-MBTI-${type}-결과.png`
} as const; 