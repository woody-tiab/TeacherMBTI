import { useState } from 'react';
import { MBTIResult, MBTITypeInfo } from '../../types/mbti';
import { shareResult, generateShareImage } from '../../utils/share';
import { SHARE_TEXT } from '../../constants/shareText';

interface QuickActionsProps {
  result: MBTIResult;
  typeInfo: MBTITypeInfo;
  onShareSuccess?: (message: string) => void;
  onShareError?: (message: string) => void;
  onClose: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const QuickActions = ({
  result,
  typeInfo,
  onShareSuccess,
  onShareError,
  onClose,
  containerRef
}: QuickActionsProps) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const shareOptions = { result, typeInfo };

  // 클립보드 복사
  const handleCopyLink = async () => {
    try {
      const result = await shareResult(shareOptions, 'copy');
      if (result.success) {
        onShareSuccess?.(result.message);
      } else {
        onShareError?.(result.message);
      }
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : SHARE_TEXT.MESSAGES.ERROR.COPY_FAILED;
      onShareError?.(errorMessage || SHARE_TEXT.MESSAGES.ERROR.COPY_FAILED);
    }
  };

  // 이미지 생성 및 다운로드 (수정된 부분: containerRef.current.querySelector 사용)
  const handleGenerateImage = async () => {
    if (!containerRef.current) return;

    setIsGeneratingImage(true);
    try {
      // containerRef 내에서 결과 카드 영역 찾기
      const resultElement = containerRef.current.querySelector('[data-share-image]') as HTMLElement;
      if (!resultElement) {
        throw new Error(SHARE_TEXT.MESSAGES.ERROR.IMAGE_ELEMENT_NOT_FOUND);
      }

      const imageData = await generateShareImage(resultElement);
      if (imageData) {
        // 이미지 다운로드
        const link = document.createElement('a');
        link.download = SHARE_TEXT.IMAGE_FILENAME(result.type);
        link.href = imageData;
        link.click();
        
        onShareSuccess?.(SHARE_TEXT.MESSAGES.SUCCESS.IMAGE_DOWNLOADED);
        onClose();
      } else {
        throw new Error(SHARE_TEXT.MESSAGES.ERROR.IMAGE_GENERATION_FAILED);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : SHARE_TEXT.MESSAGES.ERROR.IMAGE_GENERATION_FAILED;
      onShareError?.(errorMessage || SHARE_TEXT.MESSAGES.ERROR.IMAGE_GENERATION_FAILED);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="p-4 space-y-3">
      <button
        onClick={handleCopyLink}
        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="text-left">
          <div className="font-medium text-gray-900">{SHARE_TEXT.QUICK_ACTIONS.COPY_LINK.TITLE}</div>
          <div className="text-sm text-gray-600">{SHARE_TEXT.QUICK_ACTIONS.COPY_LINK.DESCRIPTION}</div>
        </div>
      </button>

      <button
        onClick={handleGenerateImage}
        disabled={isGeneratingImage}
        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          {isGeneratingImage ? (
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <div className="text-left">
          <div className="font-medium text-gray-900">{SHARE_TEXT.QUICK_ACTIONS.GENERATE_IMAGE.TITLE}</div>
          <div className="text-sm text-gray-600">{SHARE_TEXT.QUICK_ACTIONS.GENERATE_IMAGE.DESCRIPTION}</div>
        </div>
      </button>
    </div>
  );
}; 