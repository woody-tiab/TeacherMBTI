import { useState } from 'react';
import { MBTIResult, MBTITypeInfo } from '../../types/mbti';
import { getSocialLinks } from '../../utils/share';
import { SOCIAL_PLATFORMS, SocialPlatform } from '../../constants/socialPlatforms';
import { SHARE_TEXT } from '../../constants/shareText';

interface SocialShareButtonsProps {
  result: MBTIResult;
  typeInfo: MBTITypeInfo;
  onShareSuccess?: (message: string) => void;
  onShareError?: (message: string) => void;
  onClose: () => void;
}

export const SocialShareButtons = ({
  result,
  typeInfo,
  onShareSuccess,
  onShareError,
  onClose
}: SocialShareButtonsProps) => {
  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null);

  // URL 유효성 검사 함수
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 소셜 플랫폼으로 공유
  const handleSocialShare = async (platform: SocialPlatform) => {
    setLoadingPlatform(platform.key);
    
    try {
      const shareData = {
        title: SHARE_TEXT.MAIN_SHARE_TITLE,
        text: SHARE_TEXT.SHARE_MESSAGE_TEMPLATE(typeInfo.nickname, result.type),
        url: window.location.href
      };

      const socialLinks = getSocialLinks(shareData);
      const url = socialLinks[platform.key];
      
      // URL 유효성 검사
      if (!url || !isValidUrl(url)) {
        throw new Error(`잘못된 URL이 생성되었습니다: ${platform.name}`);
      }
      
      // 새 창에서 공유 페이지 열기
      const popup = window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      
      // 팝업 차단 확인
      if (!popup || popup.closed) {
        throw new Error(`팝업이 차단되었습니다. 브라우저의 팝업 차단 설정을 확인해주세요.`);
      }
      
      onShareSuccess?.(SHARE_TEXT.MESSAGES.SUCCESS.SOCIAL_SHARE(platform.name));
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `${platform.name} 공유 중 오류가 발생했습니다.`;
      onShareError?.(errorMessage);
    } finally {
      setLoadingPlatform(null);
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (event: React.KeyboardEvent, platform: SocialPlatform) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSocialShare(platform);
    }
  };

  return (
    <div className="p-4 border-t border-gray-100">
      <h4 className="text-sm md:text-base font-medium text-gray-900 mb-3 break-korean">{SHARE_TEXT.SOCIAL_MEDIA.TITLE}</h4>
      <div className="grid grid-cols-2 gap-2">
        {SOCIAL_PLATFORMS.map((platform) => (
          <button
            key={platform.key}
            onClick={() => handleSocialShare(platform)}
            onKeyDown={(e) => handleKeyDown(e, platform)}
            disabled={loadingPlatform !== null}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            aria-label={`${platform.name}으로 공유하기`}
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: platform.color }}
            >
              {loadingPlatform === platform.key ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                platform.icon
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}; 