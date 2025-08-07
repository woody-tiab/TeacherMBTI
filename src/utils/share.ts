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

export interface ImageCaptureOptions {
  backgroundColor?: string;
  scale?: number;
  quality?: number;
  format?: 'png' | 'jpeg';
  addBranding?: boolean;
}

// HTML 요소를 이미지로 변환 (html2canvas 사용)
export const generateShareImage = async (
  element: HTMLElement, 
  options: ImageCaptureOptions = {}
): Promise<string | null> => {
  let originalStyles: {
    transform: string;
    opacity: string;
    visibility: string;
    position: string;
    top: string;
    left: string;
    width: string;
    margin: string;
    padding: string;
  } | null = null;
  
  try {
    // 기본 옵션 설정
    const {
      backgroundColor = '#ffffff',
      scale = window.devicePixelRatio || 2,
      quality = 0.9,
      format = 'png',
      addBranding = true
    } = options;

    // 요소 존재 확인
    if (!element) {
      throw new Error('Target element not found');
    }

    // html2canvas를 동적으로 import
    const html2canvas = await import('html2canvas');
    const html2canvasFunction = html2canvas.default || html2canvas;

    // 이미지 캡처 전 스타일 최적화
    originalStyles = prepareElementForCapture(element);

    // html2canvas 옵션 - 더 안정적이고 고품질로 설정
    const html2canvasOptions = {
      backgroundColor,
      scale: Math.min(scale, 2), // 고해상도 유지
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: element.offsetWidth,
      height: element.offsetHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.offsetWidth,
      windowHeight: element.offsetHeight,
      x: 0,
      y: 0,
      removeContainer: true,
      foreignObjectRendering: false,
      imageTimeout: 15000,
      // 더 정교한 요소 필터링
      ignoreElements: (element: Element) => {
        const htmlEl = element as HTMLElement;
        return htmlEl.classList.contains('ignore-capture') ||
               htmlEl.tagName === 'SCRIPT' ||
               htmlEl.tagName === 'STYLE' ||
               htmlEl.classList.contains('fixed') ||
               htmlEl.style.position === 'fixed' ||
               htmlEl.getAttribute('data-html2canvas-ignore') === 'true';
      },
      // 클론된 문서 정리 - 안전한 렌더링을 위해
      onclone: (clonedDoc: Document) => {
        // 안전한 그라디언트 처리
        const style = clonedDoc.createElement('style');
        style.textContent = `
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          /* 그라디언트를 단색으로 대체 */
          [style*="linear-gradient"] {
            background-image: none !important;
          }
          .bg-gradient-to-br {
            background: #f8fafc !important;
            background-image: none !important;
          }
          /* 고정 요소 숨기기 */
          .fixed, [style*="position: fixed"] {
            display: none !important;
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    };

    // 시도 1: 일반적인 방법
    let canvas: HTMLCanvasElement;
    try {
      canvas = await html2canvasFunction(element, html2canvasOptions);
    } catch (gradientError) {
      console.warn('First attempt failed, trying with simplified options:', gradientError);
      
      // 시도 2: 더 안전한 옵션으로 재시도
      const simplifiedOptions = {
        backgroundColor: '#ffffff',
        scale: 1,
        logging: false,
        useCORS: false,
        allowTaint: true,
        width: element.offsetWidth,
        height: element.offsetHeight,
        foreignObjectRendering: false,
        ignoreElements: (el: Element) => {
          const htmlEl = el as HTMLElement;
          const style = window.getComputedStyle(htmlEl);
          return style.backgroundImage && style.backgroundImage.includes('gradient');
        },
        onclone: (clonedDoc: Document) => {
          // 모든 그라디언트 제거
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              background-image: none !important;
              background: #f8fafc !important;
            }
            .bg-gradient-to-br,
            .bg-gradient-to-r {
              background: #f8fafc !important;
              background-image: none !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      };
      
      try {
        canvas = await html2canvasFunction(element, simplifiedOptions);
      } catch (fallbackError) {
        console.error('Both attempts failed:', fallbackError);
        throw new Error('이미지 생성에 실패했습니다. 브라우저 호환성 문제일 수 있습니다.');
      }
    }

    // 브랜딩 추가 (옵션)
    let finalCanvas = canvas;
    if (addBranding) {
      try {
        finalCanvas = await addBrandingToCanvas(canvas);
      } catch (brandingError) {
        console.warn('Branding failed, using original canvas:', brandingError);
        finalCanvas = canvas;
      }
    }

    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    return finalCanvas.toDataURL(mimeType, quality);

  } catch (error) {
    console.error('Failed to generate share image:', error);
    return null;
  } finally {
    // 항상 원래 스타일 복원
    if (originalStyles && element) {
      try {
        restoreElementStyles(element, originalStyles);
      } catch (restoreError) {
        console.warn('Failed to restore styles:', restoreError);
      }
    }
    
    // 임시 요소의 원래 스타일 복원
    interface ElementWithStyle extends HTMLElement {
      _originalStyle?: {
        position: string;
        top: string;
        left: string;
        visibility: string;
        zIndex: string;
      };
    }
    
    if (element && (element as ElementWithStyle)._originalStyle) {
      try {
        const originalStyle = (element as ElementWithStyle)._originalStyle!;
        element.style.position = originalStyle.position;
        element.style.top = originalStyle.top;
        element.style.left = originalStyle.left;
        element.style.visibility = originalStyle.visibility;
        element.style.zIndex = originalStyle.zIndex;
        delete (element as ElementWithStyle)._originalStyle;
      } catch (restoreError) {
        console.warn('Failed to restore temp container styles:', restoreError);
      }
    }
  }
};

// 이미지 캡처를 위한 요소 스타일 최적화
const prepareElementForCapture = (element: HTMLElement) => {
  const originalStyles = {
    transform: element.style.transform,
    opacity: element.style.opacity,
    visibility: element.style.visibility,
    position: element.style.position,
    top: element.style.top,
    left: element.style.left,
    width: element.style.width,
    margin: element.style.margin,
    padding: element.style.padding
  };

  // 캡처 최적화를 위한 스타일 적용
  element.style.transform = 'none';
  element.style.opacity = '1';
  element.style.visibility = 'visible';
  element.style.position = 'static';
  element.style.top = 'auto';
  element.style.left = 'auto';
  element.style.margin = '0';
  
  // 고정 너비 설정으로 레이아웃 안정화
  if (element.getAttribute('data-share-image') === 'complete-results' || element.getAttribute('data-share-image') === 'temp-complete-results') {
    element.style.width = '800px';
    element.style.padding = '32px 32px 32px 32px'; // 균등한 좌우 패딩
  }

  // 문제가 되는 그라디언트 요소들을 안전한 색상으로 변경
  fixGradientElements(element);

  // print 스타일 활성화 (브랜딩 표시용)
  const printElements = element.querySelectorAll('.hidden.print\\:block');
  printElements.forEach(el => {
    (el as HTMLElement).style.display = 'block';
  });

  return originalStyles;
};

// 그라디언트 요소 안전화 함수
const fixGradientElements = (element: HTMLElement) => {
  // 모든 하위 요소 검사
  const allElements = element.querySelectorAll('*') as NodeListOf<HTMLElement>;
  
  // 자신도 포함하여 처리
  const elementsToProcess = [element, ...Array.from(allElements)];
  
  elementsToProcess.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    
    // 배경 이미지에서 linear-gradient 처리
    if (computedStyle.backgroundImage && computedStyle.backgroundImage.includes('linear-gradient')) {
      try {
        // 안전한 단색 배경으로 대체
        if (el.style.background && el.style.background.includes('linear-gradient')) {
          // JavaScript로 설정된 그라디언트를 단색으로 변경
          const colorMatch = el.style.background.match(/#[0-9a-fA-F]{6}/);
          if (colorMatch) {
            el.style.background = colorMatch[0];
            el.style.backgroundImage = 'none';
          } else {
            el.style.background = '#f8fafc'; // 기본 배경색
            el.style.backgroundImage = 'none';
          }
        } else {
          // CSS 클래스로 적용된 그라디언트 처리
          el.style.backgroundImage = 'none';
          if (el.classList.contains('bg-gradient-to-br')) {
            if (el.classList.contains('from-blue-50')) {
              el.style.backgroundColor = '#eff6ff'; // blue-50
            } else if (el.classList.contains('from-gray-50')) {
              el.style.backgroundColor = '#f9fafb'; // gray-50
            } else {
              el.style.backgroundColor = '#f8fafc'; // 기본색
            }
          }
        }
      } catch (error) {
        console.warn('Failed to fix gradient for element:', error);
        el.style.background = '#f8fafc';
        el.style.backgroundImage = 'none';
      }
    }
    
    // 투명도가 포함된 색상 값 정리
    if (el.style.background && el.style.background.includes('80')) {
      // typeInfo.color + '80' 형태의 잘못된 투명도 값 수정
      el.style.background = el.style.background.replace(/([#\w]+)80/g, '$1');
    }
  });
};

// 원래 스타일 복원
const restoreElementStyles = (element: HTMLElement, originalStyles: { 
  transform: string; 
  opacity: string; 
  visibility: string;
  position: string;
  top: string;
  left: string;
  width: string;
  margin: string;
  padding: string;
}) => {
  element.style.transform = originalStyles.transform;
  element.style.opacity = originalStyles.opacity;
  element.style.visibility = originalStyles.visibility;
  element.style.position = originalStyles.position;
  element.style.top = originalStyles.top;
  element.style.left = originalStyles.left;
  element.style.width = originalStyles.width;
  element.style.margin = originalStyles.margin;
  element.style.padding = originalStyles.padding;

  // print 스타일 복원
  const printElements = element.querySelectorAll('.hidden.print\\:block');
  printElements.forEach(el => {
    (el as HTMLElement).style.display = '';
  });
};

// 캔버스에 브랜딩 추가
const addBrandingToCanvas = async (canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> => {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // 기존 캔버스보다 약간 높게 새 캔버스 생성
    const newCanvas = document.createElement('canvas');
    const newCtx = newCanvas.getContext('2d');
    if (!newCtx) return canvas;

    const brandingHeight = 60;
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height + brandingHeight;

    // 기존 이미지 복사
    newCtx.drawImage(canvas, 0, 0);

    // 브랜딩 영역 배경
    newCtx.fillStyle = '#f8fafc';
    newCtx.fillRect(0, canvas.height, canvas.width, brandingHeight);

    // 브랜딩 텍스트
    newCtx.fillStyle = '#64748b';
    newCtx.font = `${Math.min(24, canvas.width * 0.03)}px -apple-system, BlinkMacSystemFont, sans-serif`;
    newCtx.textAlign = 'center';
    newCtx.fillText(
      '🎯 교사 MBTI 수업 스타일 분석 | 나만의 교육 스타일을 확인해보세요',
      canvas.width / 2,
      canvas.height + brandingHeight / 2 + 6
    );

    return newCanvas;
  } catch (error) {
    console.warn('Failed to add branding:', error);
    return canvas;
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