import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MBTIResult, MBTITypeInfo } from '../../types/mbti';
import { 
  shareResult, 
  ShareOptions,
  isWebShareSupported,
  getDeviceType
} from '../../utils/share';
import { ShareDropdown } from './ShareDropdown';
import { SHARE_TEXT } from '../../constants/shareText';

interface ShareButtonProps {
  result: MBTIResult;
  typeInfo: MBTITypeInfo;
  onShareSuccess?: (message: string) => void;
  onShareError?: (message: string) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
}

const ShareButton = ({
  result,
  typeInfo,
  onShareSuccess,
  onShareError,
  className = '',
  variant = 'primary',
  size = 'md'
}: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const shareOptions: ShareOptions = { result, typeInfo };
  const deviceType = getDeviceType();
  const hasWebShare = isWebShareSupported();

  // 메인 공유 함수
  const handleMainShare = async () => {
    try {
      const result = await shareResult(shareOptions, 'web');
      if (result.success) {
        onShareSuccess?.(result.message);
      } else {
        onShareError?.(result.message);
      }
    } catch (error) {
      onShareError?.(SHARE_TEXT.MESSAGES.ERROR.SHARE_FAILED);
    }
  };

  // 버튼 크기 클래스
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-3 py-2 text-sm';
      case 'lg': return 'px-6 py-3 text-lg';
      default: return 'px-4 py-2 text-base';
    }
  };

  // 버튼 스타일 클래스
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300';
      case 'icon-only':
        return 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2';
      default:
        return 'text-white shadow-md hover:shadow-lg';
    }
  };

  // 공유 버튼 라벨 결정
  const getShareButtonLabel = () => {
    return hasWebShare && deviceType === 'mobile' 
      ? SHARE_TEXT.SHARE_BUTTON_LABEL.WITH_WEB_SHARE 
      : SHARE_TEXT.SHARE_BUTTON_LABEL.WITHOUT_WEB_SHARE;
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* 메인 공유 버튼 */}
      {variant === 'icon-only' ? (
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-full transition-all duration-200 ${getVariantClasses()} ${className}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="공유 옵션 열기"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </motion.button>
      ) : (
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={handleMainShare}
            className={`rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${getSizeClasses()} ${getVariantClasses()} ${className}`}
            style={{
              backgroundColor: variant === 'primary' ? typeInfo.color : undefined
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>{getShareButtonLabel()}</span>
          </motion.button>

          {/* 더 많은 옵션 버튼 */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={`rounded-lg p-2 transition-all duration-200 ${getVariantClasses()}`}
            style={{
              backgroundColor: variant === 'primary' ? typeInfo.color : undefined
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={SHARE_TEXT.DROPDOWN.MORE_OPTIONS_LABEL}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </div>
      )}

      {/* 공유 옵션 드롭다운 */}
      <ShareDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        result={result}
        typeInfo={typeInfo}
        onShareSuccess={onShareSuccess}
        onShareError={onShareError}
        containerRef={containerRef}
      />
    </div>
  );
};

export default ShareButton; 