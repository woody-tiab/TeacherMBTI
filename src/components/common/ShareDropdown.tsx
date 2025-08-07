import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SHARE_TEXT } from '../../constants/shareText';
import { QuickActions } from './QuickActions';
import { MBTIResult, MBTITypeInfo } from '../../types/mbti';

interface ShareDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  result: MBTIResult;
  typeInfo: MBTITypeInfo;
  onShareSuccess?: (message: string) => void;
  onShareError?: (message: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const ShareDropdown = ({
  isOpen,
  onClose,
  result,
  typeInfo,
  onShareSuccess,
  onShareError,
  containerRef
}: ShareDropdownProps) => {
  // Escape 키 이벤트 리스너 추가
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{SHARE_TEXT.DROPDOWN.TITLE}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={SHARE_TEXT.DROPDOWN.CLOSE_LABEL}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {SHARE_TEXT.DROPDOWN.SUBTITLE}
              </p>
            </div>

            {/* 빠른 액션 */}
            <QuickActions
              result={result}
              typeInfo={typeInfo}
              onShareSuccess={onShareSuccess}
              onShareError={onShareError}
              onClose={onClose}
              containerRef={containerRef}
            />

          </motion.div>
        )}
      </AnimatePresence>

      {/* 오버레이 (모바일에서 드롭다운 닫기용) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}; 