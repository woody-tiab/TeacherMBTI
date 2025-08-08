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

    // DOM 레이아웃 계산 완룉 대기
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 정확한 콘텐츠 크기 측정 (불필요한 여백 없이)
    const fullWidth = Math.max(
      element.offsetWidth,
      element.scrollWidth,
      element.getBoundingClientRect().width
    );
    
    const fullHeight = Math.max(
      element.offsetHeight,
      element.scrollHeight,
      element.getBoundingClientRect().height
    );
    
    // 최소한의 여유 공간만 추가 (텍스트 잘림 방지)
    const optimizedHeight = fullHeight + 20;

    // html2canvas 옵션 - 정확한 콘텐츠 크기로 최적화
    const html2canvasOptions = {
      backgroundColor,
      scale: Math.min(scale, 2), // 고해상도 유지
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: fullWidth, // 정확한 너비
      height: optimizedHeight, // 최적화된 높이
      scrollX: 0,
      scrollY: 0,
      windowWidth: Math.max(fullWidth, 1000), // 최소한의 창 너비
      windowHeight: optimizedHeight, // 실제 콘텐츠 높이에 맞춤
      x: 0,
      y: 0,
      removeContainer: false, // 컨테이너 제거하지 않음
      foreignObjectRendering: false,
      imageTimeout: 25000, // 25초 타임아웃
      canvas: null, // 캔버스 재사용 방지
      // 강화된 요소 필터링 - 불필요한 요소 완전 제거
      ignoreElements: (element: Element) => {
        const htmlEl = element as HTMLElement;
        const textContent = htmlEl.textContent || '';
        
        // 기본 필터링 조건
        if (htmlEl.classList.contains('ignore-capture') ||
            htmlEl.tagName === 'SCRIPT' ||
            htmlEl.tagName === 'STYLE' ||
            htmlEl.classList.contains('fixed') ||
            htmlEl.style.position === 'fixed' ||
            htmlEl.getAttribute('data-html2canvas-ignore') === 'true') {
          return true;
        }
        
        // 파일 경로 패턴 필터링 (예: e:\Down\화면 캡처...)
        const filePathPatterns = [
          /^[a-zA-Z]:[\\/].*\.(png|jpg|jpeg|gif|bmp|webp)$/i, // 일반적인 파일 경로
          /^화면\s*캡처/i, // 화면 캡처 텍스트
          /^Screenshot/i, // Screenshot 텍스트
          /\\Down\\/i, // Down 폴더 경로
        ];
        
        return filePathPatterns.some(pattern => pattern.test(textContent.trim()));
      },
      // 클론된 문서 정리 - 안전한 렌더링을 위해
      onclone: (clonedDoc: Document) => {
        // 안전한 그라디언트 처리 및 이모지 폰트 최적화
        const style = clonedDoc.createElement('style');
        style.textContent = `
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          /* 이모지 폰트 최적화 */
          .emoji, [style*="emoji"] {
            font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Segoe UI Symbol', sans-serif !important;
            font-feature-settings: 'kern' 1;
            text-rendering: optimizeLegibility;
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
          /* 교육 스타일 섹션 아이콘 최적화 */
          [style*="Apple Color Emoji"] {
            font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif !important;
            font-variant-emoji: emoji !important;
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
        width: fullWidth, // 정확한 너비
        height: optimizedHeight, // 최적화된 높이
        windowWidth: Math.max(fullWidth, 1000), // 최소한의 창 너비
        windowHeight: optimizedHeight, // 실제 콘텐츠 높이
        removeContainer: false, // 컨테이너 제거하지 않음
        imageTimeout: 25000, // 25초 타임아웃
        foreignObjectRendering: false,
        ignoreElements: (el: Element) => {
          const htmlEl = el as HTMLElement;
          const style = window.getComputedStyle(htmlEl);
          const textContent = htmlEl.textContent || '';
          
          // 그라디언트 배경 필터링
          if (style.backgroundImage && style.backgroundImage.includes('gradient')) {
            return true;
          }
          
          // 파일 경로 패턴 필터링
          const filePathPatterns = [
            /^[a-zA-Z]:[\\/].*\.(png|jpg|jpeg|gif|bmp|webp)$/i,
            /^화면\s*캡처/i,
            /^Screenshot/i,
            /\\Down\\/i,
          ];
          
          return filePathPatterns.some(pattern => pattern.test(textContent.trim()));
        },
        onclone: (clonedDoc: Document) => {
          // 모든 그라디언트 제거 및 이모지 폰트 최적화
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
            /* 이모지 폰트 최적화 */
            [style*="Apple Color Emoji"] {
              font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif !important;
              font-variant-emoji: emoji !important;
              text-rendering: optimizeLegibility !important;
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
    element.style.width = '1000px';
    element.style.padding = '40px 40px 40px 40px'; // 균등한 패딩
    // minHeight 제거 - 동적 크기 조정에 맡김
  }

  // 전체 콘텐츠가 표시되도록 높이 제한 해제
  element.style.maxHeight = 'none';
  element.style.overflow = 'visible';
  
  // 자식 요소들의 overflow도 visible로 설정
  const childElements = element.querySelectorAll('*') as NodeListOf<HTMLElement>;
  childElements.forEach(child => {
    if (child.style.maxHeight) {
      child.style.maxHeight = 'none';
    }
    if (child.style.overflow === 'hidden' || child.style.overflow === 'scroll' || child.style.overflow === 'auto') {
      child.style.overflow = 'visible';
    }
  });

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

  // 추가된 스타일 복원
  element.style.maxHeight = '';
  element.style.overflow = '';

  // 자식 요소들의 스타일도 복원
  const childElements = element.querySelectorAll('*') as NodeListOf<HTMLElement>;
  childElements.forEach(child => {
    child.style.maxHeight = '';
    child.style.overflow = '';
  });

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