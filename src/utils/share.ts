import { MBTIResult, MBTITypeInfo } from '../types/mbti';
import { SHARE_TEXT } from '../constants/shareText';

export interface ShareData {
  title: string;
  text: string;
  url: string;
  image?: string;
}

export interface ShareOptions {
  result: MBTIResult;
  typeInfo: MBTITypeInfo;
  customMessage?: string;
}

// Web Share API 지원 여부 확인
export const isWebShareSupported = (): boolean => {
  return 'share' in navigator && 'canShare' in navigator;
};

// 공유용 텍스트 생성
export const generateShareText = (options: ShareOptions): string => {
  const { result, typeInfo, customMessage } = options;
  
  if (customMessage) {
    return customMessage;
  }

  return `${SHARE_TEXT.SHARE_MESSAGE_TEMPLATE(typeInfo.nickname, result.type)}
🎭 특성: ${typeInfo.description}

✨ 나만의 교육 스타일을 확인해보세요!`;
};

// Web Share API를 사용한 공유
export const shareViaWebAPI = async (shareData: ShareData): Promise<boolean> => {
  if (!isWebShareSupported()) {
    throw new Error('Web Share API is not supported');
  }

  try {
    if (navigator.canShare && !navigator.canShare(shareData)) {
      throw new Error('Cannot share this content');
    }
    
    await navigator.share(shareData);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // 사용자가 공유를 취소한 경우
      return false;
    }
    throw error;
  }
};

// 클립보드에 복사
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 클립보드 API를 지원하지 않는 경우 폴백
      return fallbackCopyToClipboard(text);
    }
  } catch (error) {
    console.warn('Clipboard API failed, using fallback:', error);
    return fallbackCopyToClipboard(text);
  }
};

// 클립보드 복사 폴백 메서드
const fallbackCopyToClipboard = (text: string): boolean => {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error('Fallback copy failed:', error);
    return false;
  }
};

// SNS 직접 공유 링크 생성
export const getSocialLinks = (shareData: ShareData) => {
  const encodedText = encodeURIComponent(shareData.text);
  const encodedUrl = encodeURIComponent(shareData.url);
  const encodedTitle = encodeURIComponent(shareData.title);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    kakao: `https://story.kakao.com/share?url=${encodedUrl}&text=${encodedText}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedText}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`
  };
};

// HTML 요소를 이미지로 변환 (html2canvas 사용)
export const generateShareImage = async (element: HTMLElement): Promise<string | null> => {
  try {
    // html2canvas를 동적으로 import
    const html2canvas = await import('html2canvas');
    const html2canvasFunction = html2canvas.default || html2canvas;

    // html2canvas 옵션을 정확한 타입으로 정의
    const options = {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: false,
      width: element.offsetWidth,
      height: element.offsetHeight
    };

    const canvas = await html2canvasFunction(element, options);

    return canvas.toDataURL('image/png', 0.9);
  } catch (error) {
    console.error('Failed to generate share image:', error);
    // html2canvas를 불러올 수 없는 경우에도 앱이 동작하도록 null 반환
    return null;
  }
};

// 통합 공유 함수
export const shareResult = async (
  options: ShareOptions, 
  method: 'web' | 'copy' | 'social' = 'web'
): Promise<{ success: boolean; message: string }> => {
  const shareData: ShareData = {
    title: SHARE_TEXT.MAIN_SHARE_TITLE,
    text: generateShareText(options),
    url: window.location.href
  };

  try {
    switch (method) {
      case 'web':
        if (isWebShareSupported()) {
          const success = await shareViaWebAPI(shareData);
          return {
            success,
            message: success ? SHARE_TEXT.MESSAGES.SUCCESS.SHARE_COMPLETED : SHARE_TEXT.MESSAGES.SUCCESS.SHARE_CANCELLED
          };
        } else {
          // Web Share API를 지원하지 않는 경우 클립보드 복사로 폴백
          const copied = await copyToClipboard(`${shareData.text}\n\n${shareData.url}`);
          return {
            success: copied,
            message: copied ? SHARE_TEXT.MESSAGES.SUCCESS.LINK_COPIED : SHARE_TEXT.MESSAGES.ERROR.COPY_FAILED
          };
        }

      case 'copy': {
        const copied = await copyToClipboard(`${shareData.text}\n\n${shareData.url}`);
        return {
          success: copied,
          message: copied ? SHARE_TEXT.MESSAGES.SUCCESS.LINK_COPIED : SHARE_TEXT.MESSAGES.ERROR.COPY_FAILED
        };
      }

      case 'social':
        // 소셜 링크는 즉시 성공으로 처리 (외부 창 열기)
        return {
          success: true,
          message: SHARE_TEXT.MESSAGES.SUCCESS.SHARE_COMPLETED
        };

      default:
        throw new Error('Unsupported share method');
    }
  } catch (error) {
    console.error('Share failed:', error);
    return {
      success: false,
      message: SHARE_TEXT.MESSAGES.ERROR.SHARE_FAILED
    };
  }
};

// 디바이스 감지
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);

  if (isMobile && !isTablet) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
};

// 공유 방법 추천
export const getRecommendedShareMethods = () => {
  const deviceType = getDeviceType();
  const hasWebShare = isWebShareSupported();

  if (deviceType === 'mobile' && hasWebShare) {
    return ['web', 'copy', 'social'];
  }
  
  return ['copy', 'social'];
}; 