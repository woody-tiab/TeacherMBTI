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
  containerRef: _containerRef // eslint-disable-line @typescript-eslint/no-unused-vars
}: QuickActionsProps) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);

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

  // 전체 결과 이미지 생성 및 다운로드 - 실제 CompleteResults 사용
  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setCaptureProgress(0);
    
    let tempContainer: HTMLElement | null = null;
    
    try {
      setCaptureProgress(20);
      
      // 기존 DOM 요소를 복사하여 이미지 생성용 컨테이너 생성
      tempContainer = await createImageFromExistingContent();
      
      if (!tempContainer) {
        throw new Error(SHARE_TEXT.MESSAGES.ERROR.IMAGE_ELEMENT_NOT_FOUND);
      }

      setCaptureProgress(50);
      
      const imageData = await generateShareImage(tempContainer);
      
      setCaptureProgress(80);
      
      if (imageData) {
        // 이미지 다운로드
        const link = document.createElement('a');
        const filename = `교사MBTI_${result.type}_전체결과.png`;
        link.download = filename;
        link.href = imageData;
        link.click();
        
        setCaptureProgress(100);
        onShareSuccess?.(SHARE_TEXT.MESSAGES.SUCCESS.IMAGE_DOWNLOADED);
        onClose();
      } else {
        throw new Error(SHARE_TEXT.MESSAGES.ERROR.IMAGE_GENERATION_FAILED);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : SHARE_TEXT.MESSAGES.ERROR.IMAGE_GENERATION_FAILED;
      onShareError?.(errorMessage || SHARE_TEXT.MESSAGES.ERROR.IMAGE_GENERATION_FAILED);
    } finally {
      // 임시 컨테이너 완전히 제거
      if (tempContainer) {
        try {
          // 먼저 DOM에서 제거
          if (tempContainer.parentNode) {
            tempContainer.parentNode.removeChild(tempContainer);
          }
          
          // ID로 찾아서 제거 (중복 방지)
          const existingContainer = document.getElementById('temp-image-container');
          if (existingContainer && existingContainer !== tempContainer) {
            existingContainer.parentNode?.removeChild(existingContainer);
          }
          
        } catch (cleanupError) {
          console.warn('Failed to cleanup temp container:', cleanupError);
        }
      }
      
      setIsGeneratingImage(false);
      setCaptureProgress(0);
    }
  };

  // 상수로 정의된 글꼴 스택
  const FONT_STACK = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, \'Noto Sans\', sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\', \'Noto Color Emoji\'';

  // 기존 페이지의 콘텐츠를 복사하여 이미지 생성용 컨테이너 생성
  const createImageFromExistingContent = async (): Promise<HTMLElement | null> => {
    try {
      // 이전에 남은 임시 컨테이너 완전 제거
      const existingContainers = document.querySelectorAll('[id^="temp-image-container"]');
      existingContainers.forEach(container => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      });
      
      // 새로운 임시 컨테이너 생성
      const tempContainer = document.createElement('div');
      tempContainer.setAttribute('data-share-image', 'complete-results');
      tempContainer.id = 'temp-image-container';
      
      // 최적화된 컨테이너 스타일 - 전체 콘텐츠에 맞춰 정확한 크기 설정
      tempContainer.style.cssText = `
        position: fixed;
        top: 50px;
        left: 50px;
        width: 1000px;
        height: auto;
        min-height: auto;
        max-height: none;
        background: #ffffff;
        padding: 40px;
        z-index: 9999;
        visibility: visible;
        opacity: 1;
        border-radius: 16px;
        font-family: ${FONT_STACK};
        box-sizing: border-box;
        overflow: visible;
        line-height: 1.7;
        color: #111827;
        word-break: keep-all;
        white-space: normal;
      `;
      
      // body에 추가
      document.body.appendChild(tempContainer);
      
      // 렌더링 대기 및 크기 재조정을 위한 초기 대기
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 헤더 추가
      const header = document.createElement('div');
      header.style.cssText = 'text-align: center; margin-bottom: 32px;';
      
      // h1 요소 생성
      const h1 = document.createElement('h1');
      h1.style.cssText = `font-family: ${FONT_STACK}; font-size: 2rem; font-weight: bold; color: #111827; margin-bottom: 16px;`;
      h1.textContent = '교사 MBTI 분석 결과';
      
      // p 요소 생성
      const p = document.createElement('p');
      p.style.cssText = `font-family: ${FONT_STACK}; color: #6b7280; max-width: 500px; margin: 0 auto;`;
      p.textContent = '당신의 교육 스타일과 성격 특성을 종합적으로 분석한 결과입니다';
      
      header.appendChild(h1);
      header.appendChild(p);
      tempContainer.appendChild(header);
      
      // 4개 섹션 컨테이너
      const sectionsContainer = document.createElement('div');
      sectionsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 32px;';
      
      // 각 섹션 생성
      const sections = [
        { title: '📊 결과 개요', content: createResultOverviewSection() },
        { title: '📋 상세 분석', content: createDetailedAnalysisSection() },
        { title: '🎯 교육 스타일', content: createTeachingStyleSection() },
        { title: '📈 성향 분석', content: createTendencyAnalysisSection() }
      ];
      
      sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.style.cssText = 'margin-bottom: 32px;';
        
        // h2 요소 생성
        const h2 = document.createElement('h2');
        h2.style.cssText = 'font-size: 1.25rem; font-weight: 600; color: #111827; margin-bottom: 16px;';
        h2.textContent = section.title;
        
        // 콘텐츠 컨테이너 생성
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = section.content; // section.content는 내부에서 이미 검증된 안전한 HTML
        
        sectionDiv.appendChild(h2);
        sectionDiv.appendChild(contentDiv);
        sectionsContainer.appendChild(sectionDiv);
      });
      
      tempContainer.appendChild(sectionsContainer);
      
      // 브랜딩 추가
      const branding = document.createElement('div');
      branding.style.cssText = 'margin-top: 32px; text-align: center;';
      
      const brandingCard = document.createElement('div');
      brandingCard.style.cssText = 'background: rgba(255,255,255,0.8); border-radius: 8px; padding: 16px; border: 1px solid #e5e7eb;';
      
      const brandingText = document.createElement('p');
      brandingText.style.cssText = `font-family: ${FONT_STACK}; font-size: 0.875rem; color: #6b7280;`;
      brandingText.textContent = '🎯 교사 MBTI 수업 스타일 분석 | 나만의 교육 스타일을 확인해보세요';
      
      brandingCard.appendChild(brandingText);
      branding.appendChild(brandingCard);
      tempContainer.appendChild(branding);
      
      // 렌더링 완료 기다리기
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 실제 콘텐츠의 정확한 크기 측정 (최소한의 여백만 포함)
      const measureActualContentHeight = () => {
        let totalHeight = 0;
        
        // 상단 패딩 40px
        totalHeight += 40;
        
        // 각 자식 요소의 실제 높이 측정
        Array.from(tempContainer.children).forEach((child) => {
          const element = child as HTMLElement;
          const rect = element.getBoundingClientRect();
          const styles = window.getComputedStyle(element);
          
          // 요소 높이 + 마진
          const elementHeight = rect.height + 
            parseFloat(styles.marginTop) + 
            parseFloat(styles.marginBottom);
          
          totalHeight += elementHeight;
        });
        
        // 하단 패딩 40px
        totalHeight += 40;
        
        return Math.ceil(totalHeight);
      };
      
      // 여러 번 측정하여 안정적인 값 확보
      let actualContentHeight = 0;
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const measured = measureActualContentHeight();
        actualContentHeight = Math.max(actualContentHeight, measured);
      }
      
      // 최소한의 여유 공간만 추가 (텍스트 잘림 방지를 위한 안전 마진)
      const safetyMargin = 60; // 최소한의 안전 마진
      const finalHeight = actualContentHeight + safetyMargin;
      
      tempContainer.style.height = `${finalHeight}px`;
      tempContainer.style.minHeight = `${finalHeight}px`;
      
      // 컨테이너 크기 조정 후 최종 렌더링 대기
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 컨테이너에서 불필요한 콘텐츠 제거 (파일 경로 등)
      const cleanupUnwantedContent = (container: HTMLElement) => {
        const walker = document.createTreeWalker(
          container,
          NodeFilter.SHOW_TEXT
        );
        
        const textNodesToRemove: Node[] = [];
        let node;
        
        while ((node = walker.nextNode())) {
          const textContent = node.textContent?.trim() || '';
          
          // 파일 경로 패턴 필터링
          const unwantedPatterns = [
            /^[a-zA-Z]:[\\/].*\.(png|jpg|jpeg|gif|bmp|webp)$/i,
            /^화면\s*캡처/i,
            /^Screenshot/i,
            /\\Down\\/i,
            /^temp-image-container/i,
          ];
          
          if (unwantedPatterns.some(pattern => pattern.test(textContent))) {
            textNodesToRemove.push(node);
          }
        }
        
        // 불필요한 텍스트 노드 제거
        textNodesToRemove.forEach(node => {
          if (node.parentNode) {
            node.parentNode.removeChild(node);
          }
        });
      };
      
      cleanupUnwantedContent(tempContainer);
      
      return tempContainer;
    } catch (error) {
      console.error('Failed to create image container:', error);
      // 에러 발생 시 모든 임시 컨테이너 제거
      const existing = document.querySelectorAll('[id^="temp-image-container"]');
      existing.forEach(container => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      });
      return null;
    }
  };

  // 새로운 섹션 생성 함수들 - 실제 웹페이지와 일치
  const createResultOverviewSection = (): string => {
    return `
      <div style="position: relative; overflow: hidden; border-radius: 12px; padding: 32px; background: linear-gradient(to bottom right, #eff6ff, #e0e7ff); border: 2px solid white; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
        <!-- 배경 그라데이션 -->
        <div style="position: absolute; inset: 0; opacity: 0.1; background: linear-gradient(135deg, ${typeInfo.color} 0%, ${typeInfo.color}80 100%);"></div>
        
        <!-- 메인 콘텐츠 -->
        <div style="position: relative; z-index: 10;">
          <!-- 타입 헤더 -->
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 16px;">
              <div style="width: 80px; height: 80px; border-radius: 50%; background: ${typeInfo.color}; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold; box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.15);">
                ${result.type}
              </div>
              <div style="text-align: left;">
                <h1 style="font-size: 2.25rem; font-weight: bold; color: #111827; margin: 0; line-height: 1.2;">
                  ${typeInfo.nickname}
                </h1>
              </div>
            </div>
            
            <p style="font-size: 1.125rem; color: #374151; line-height: 1.7; max-width: 500px; margin: 0 auto;">
              ${typeInfo.description}
            </p>
          </div>

          <!-- 신뢰도 표시 -->
          <div style="background: rgba(255,255,255,0.5); border-radius: 8px; padding: 16px; border: 1px solid #d1d5db; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 0.875rem; font-weight: 500; color: #374151;">결과 신뢰도</span>
              <span style="font-size: 0.875rem; font-weight: bold; color: #111827;">${result.confidence}%</span>
            </div>
            <div style="width: 100%; background: #d1d5db; border-radius: 9999px; height: 8px;">
              <div style="height: 8px; border-radius: 9999px; background: ${typeInfo.color}; width: ${result.confidence}%;"></div>
            </div>
            <p style="font-size: 0.875rem; color: #6b7280; margin: 8px 0 0 0;">
              ${result.confidence >= 80 
                ? "매우 높은 신뢰도의 결과입니다" 
                : result.confidence >= 60
                ? "적정 수준의 신뢰도입니다"
                : "추가적인 분석이 도움될 수 있습니다"
              }
            </p>
          </div>

          <!-- 4차원 점수 요약 -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
            ${[
              { 
                dimension: '에너지 방향', 
                score: result.percentages.EI, 
                label: result.percentages.EI >= 50 ? '외향형 (E)' : '내향형 (I)',
                value: result.percentages.EI >= 50 ? result.percentages.EI : 100 - result.percentages.EI
              },
              { 
                dimension: '정보 수집', 
                score: result.percentages.SN, 
                label: result.percentages.SN >= 50 ? '직관형 (N)' : '감각형 (S)',
                value: result.percentages.SN >= 50 ? result.percentages.SN : 100 - result.percentages.SN
              },
              { 
                dimension: '판단 기준', 
                score: result.percentages.TF, 
                label: result.percentages.TF >= 50 ? '감정형 (F)' : '사고형 (T)',
                value: result.percentages.TF >= 50 ? result.percentages.TF : 100 - result.percentages.TF
              },
              { 
                dimension: '생활 양식', 
                score: result.percentages.JP, 
                label: result.percentages.JP >= 50 ? '인식형 (P)' : '판단형 (J)',
                value: result.percentages.JP >= 50 ? result.percentages.JP : 100 - result.percentages.JP
              }
            ].map(item => `
              <div style="background: rgba(255,255,255,0.6); border-radius: 8px; padding: 16px; text-center; border: 1px solid #d1d5db;">
                <div style="font-size: 0.875rem; font-weight: 500; color: #6b7280; margin-bottom: 4px;">${item.dimension}</div>
                <div style="font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 8px;">${item.label}</div>
                <div style="font-size: 2rem; font-weight: bold; color: ${typeInfo.color};">
                  ${Math.round(item.value)}%
                </div>
              </div>
            `).join('')}
          </div>

          <!-- 공유용 브랜딩 -->
          <div style="background: rgba(255,255,255,0.7); border-radius: 8px; padding: 12px; text-center; border: 1px solid #d1d5db; margin-top: 24px;">
            <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">
              🎯 교사 MBTI 수업 스타일 분석 | 나만의 교육 스타일을 확인해보세요
            </p>
          </div>
        </div>
      </div>
    `;
  };

  const createDetailedAnalysisSection = (): string => {
    return `
      <div style="background: white; border-radius: 12px; padding: 24px; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
        <div style="margin-bottom: 32px;">
          <h4 style="font-size: 1.125rem; font-weight: 600; color: #111827; margin-bottom: 16px; display: flex; align-items: center;">
            <span style="width: 32px; height: 32px; border-radius: 50%; background: ${typeInfo.color}; display: flex; align-items: center; justify-content: center; color: white; margin-right: 12px;">
              <svg style="width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </span>
            교육자로서의 강점
          </h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            ${typeInfo.strengths.map(strength => `
              <div style="background: #f0f9ff; border-radius: 8px; padding: 12px; border-left: 4px solid ${typeInfo.color};">
                <div style="font-weight: 500; color: #111827; font-size: 0.875rem;">✅ ${strength}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-bottom: 32px;">
          <h4 style="font-size: 1.125rem; font-weight: 600; color: #111827; margin-bottom: 16px; display: flex; align-items: center;">
            <span style="width: 32px; height: 32px; border-radius: 50%; background: #f97316; display: flex; align-items: center; justify-content: center; color: white; margin-right: 12px;">
              <svg style="width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </span>
            개선이 필요한 영역
          </h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            ${typeInfo.weaknesses.map(weakness => `
              <div style="background: #fef7e7; border-radius: 8px; padding: 12px; border-left: 4px solid #f59e0b;">
                <div style="font-weight: 500; color: #111827; font-size: 0.875rem;">💡 ${weakness}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <h4 style="font-size: 1.125rem; font-weight: 600; color: #111827; margin-bottom: 16px; display: flex; align-items: center;">
            <span style="width: 32px; height: 32px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; color: white; margin-right: 12px;">
              <svg style="width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </span>
            성장을 위한 실용적 팁
          </h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            ${typeInfo.tips.map(tip => `
              <div style="background: #f0f9ff; border-radius: 8px; padding: 12px; border-left: 4px solid #3b82f6;">
                <div style="font-weight: 500; color: #111827; font-size: 0.875rem;">💬 ${tip}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-top: 32px;">
          <h4 style="font-size: 1.125rem; font-weight: 600; color: #111827; margin-bottom: 16px; display: flex; align-items: center;">
            <span style="width: 32px; height: 32px; border-radius: 50%; background: ${typeInfo.color}; display: flex; align-items: center; justify-content: center; color: white; margin-right: 12px;">
              <svg style="width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </span>
            잘 맞는 학생 유형
          </h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            ${typeInfo.compatibleStudentTypes.map(studentType => `
              <div style="background: #fef3ff; border-radius: 8px; padding: 12px; border-left: 4px solid ${typeInfo.color};">
                <div style="font-weight: 500; color: #111827; font-size: 0.875rem;">👥 ${studentType}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  };

  const createTeachingStyleSection = (): string => {
    const { teachingStyle } = typeInfo;
    
    // html2canvas 호환을 위한 이모지 아이콘과 단색 배경 사용
    const styleAspects = [
      {
        title: "전체적인 교육 철학",
        content: teachingStyle?.overview || typeInfo.description,
        iconEmoji: "📚",
        bgColor: "#3b82f6"
      },
      {
        title: "학급 운영 방식", 
        content: teachingStyle?.classroomManagement || '체계적이고 학생 중심적인 학급 운영을 통해 효과적인 학습 환경을 조성합니다.',
        iconEmoji: "👥",
        bgColor: "#10b981"
      },
      {
        title: "교수법 및 수업 진행",
        content: teachingStyle?.instructionMethod || '다양한 교수법을 활용하여 학생들의 이해도를 높이고 참여를 유도합니다.',
        iconEmoji: "🎓",
        bgColor: "#f97316"
      },
      {
        title: "학생과의 상호작용",
        content: teachingStyle?.studentInteraction || '학생들과 긍정적인 관계를 구축하며 개별적인 필요를 파악하고 지원합니다.',
        iconEmoji: "💬",
        bgColor: "#ec4899"
      },
      {
        title: "평가 및 피드백 방식",
        content: teachingStyle?.assessment || '공정하고 건설적인 평가를 통해 학생들의 성장을 돕습니다.',
        iconEmoji: "📊",
        bgColor: "#6366f1"
      }
    ];
    
    return `
      <div style="background: white; border-radius: 16px; padding: 32px 24px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border: 1px solid #f3f4f6; overflow: hidden;">
        <div style="text-center; margin-bottom: 32px;">
          <h2 style="font-family: ${FONT_STACK}; font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 16px;">당신의 교사 수업 스타일</h2>
          <p style="font-family: ${FONT_STACK}; font-size: 16px; color: #6b7280; max-width: 600px; margin: 0 auto;">MBTI 성향에 따른 구체적인 교육 방식과 학급 운영 특성을 알아보세요</p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 24px;">
          ${styleAspects.map(aspect => `
            <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); border: 1px solid #f3f4f6; position: relative; overflow: hidden;">
              <!-- 상단 색상 라인 - html2canvas 최적화 -->
              <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background-color: ${aspect.bgColor}; background-image: none;"></div>
              
              <div style="display: flex; align-items: flex-start; gap: 16px;">
                <!-- 이모지 아이콘 - html2canvas 최적화 -->
                <div style="width: 48px; height: 48px; border-radius: 12px; background-color: ${aspect.bgColor}; background-image: none; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); font-size: 24px; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif; line-height: 1; text-align: center;">
                  ${aspect.iconEmoji}
                </div>
                
                <!-- 콘텐츠 -->
                <div style="flex: 1; min-width: 0;">
                  <h3 style="font-family: ${FONT_STACK}; font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 12px; line-height: 1.4;">
                    ${aspect.title}
                  </h3>
                  <p style="font-family: ${FONT_STACK}; font-size: 14px; color: #374151; line-height: 1.7; margin: 0; word-break: keep-all;">
                    ${aspect.content}
                  </p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- 추가 인사이트 -->
        <div style="margin-top: 32px; background: white; border-radius: 12px; padding: 32px; text-align: center; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); border: 1px solid #f3f4f6;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background-color: ${typeInfo.color}; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: white; font-size: 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
            ✨
          </div>
          
          <h3 style="font-family: ${FONT_STACK}; font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 16px;">
            ${typeInfo.nickname}만의 특별한 교육 방식
          </h3>
          
          <p style="font-family: ${FONT_STACK}; font-size: 14px; color: #6b7280; line-height: 1.7; max-width: 600px; margin: 0 auto; word-break: keep-all;">
            이러한 특성들이 조화롭게 어우러져 당신만의 독특하고 효과적인 교육 스타일을 만들어냅니다. 
            강점을 더욱 발전시키고 개선 영역에 관심을 기울인다면 더욱 탁월한 교육자가 될 수 있습니다.
          </p>
        </div>
      </div>
    `;
  };

  const createTendencyAnalysisSection = (): string => {
    return `
      <div style="background: white; border-radius: 12px; padding: 32px; border: 2px solid white; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 16px;">MBTI 4차원 성격 분석</h2>
          <p style="color: #6b7280; font-size: 1rem; max-width: 500px; margin: 0 auto;">각 차원별 성향의 비율과 특성을 자세히 살펴보세요</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px;">
          ${[
            {
              name: '에너지 방향',
              leftType: '내향형 (I)',
              rightType: '외향형 (E)',
              leftDesc: '내면의 세계에 집중하며 깊이 있는 상호작용을 선호',
              rightDesc: '외부 세계와의 활발한 소통과 에너지 교환을 선호',
              leftValue: 100 - result.percentages.EI,
              rightValue: result.percentages.EI
            },
            {
              name: '정보 수집',
              leftType: '감각형 (S)',
              rightType: '직관형 (N)',
              leftDesc: '구체적이고 실질적인 정보와 경험을 중시',
              rightDesc: '가능성과 패턴, 미래 지향적 아이디어를 중시',
              leftValue: 100 - result.percentages.SN,
              rightValue: result.percentages.SN
            },
            {
              name: '판단 기준',
              leftType: '사고형 (T)',
              rightType: '감정형 (F)',
              leftDesc: '논리적 분석과 객관적 기준을 바탕으로 판단',
              rightDesc: '가치관과 사람들의 감정을 고려한 판단',
              leftValue: 100 - result.percentages.TF,
              rightValue: result.percentages.TF
            },
            {
              name: '생활 양식',
              leftType: '판단형 (J)',
              rightType: '인식형 (P)',
              leftDesc: '계획적이고 체계적인 접근을 선호',
              rightDesc: '유연하고 적응적인 접근을 선호',
              leftValue: 100 - result.percentages.JP,
              rightValue: result.percentages.JP
            }
          ].map(dimension => {
            const isLeftDominant = dimension.leftValue > dimension.rightValue;
            return `
              <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 16px;">
                  <h3 style="font-size: 1.125rem; font-weight: 600; color: #111827; margin-bottom: 8px;">${dimension.name}</h3>
                  <div style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.875rem; color: #6b7280;">
                    <span style="font-weight: ${isLeftDominant ? '600' : '400'};">${dimension.leftType}</span>
                    <span>vs</span>
                    <span style="font-weight: ${!isLeftDominant ? '600' : '400'};">${dimension.rightType}</span>
                  </div>
                </div>

                <!-- 시각적 막대 그래프 - html2canvas 호환 버전 -->
                <div style="margin-bottom: 16px;">
                  <!-- 배경 막대 -->
                  <div style="width: 100%; height: 48px; background: #d1d5db; border-radius: 24px; overflow: hidden; position: relative;">
                    <!-- 왼쪽과 오른쪽을 flexbox로 분할 -->
                    <div style="display: flex; width: 100%; height: 100%;">
                      <!-- 왼쪽 영역 -->
                      <div style="
                        width: ${dimension.leftValue}%;
                        height: 100%;
                        background: ${isLeftDominant ? typeInfo.color : '#9ca3af'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 24px 0 0 24px;
                        position: relative;
                      ">
                        ${dimension.leftValue > 15 ? `
                          <span style="color: white; font-weight: 600; font-size: 0.875rem;">
                            ${Math.round(dimension.leftValue)}%
                          </span>
                        ` : ''}
                      </div>
                      
                      <!-- 오른쪽 영역 -->
                      <div style="
                        width: ${dimension.rightValue}%;
                        height: 100%;
                        background: ${!isLeftDominant ? typeInfo.color : '#9ca3af'};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 0 24px 24px 0;
                        position: relative;
                      ">
                        ${dimension.rightValue > 15 ? `
                          <span style="color: white; font-weight: 600; font-size: 0.875rem;">
                            ${Math.round(dimension.rightValue)}%
                          </span>
                        ` : ''}
                      </div>
                    </div>
                    
                    <!-- 중앙 구분선 -->
                    <div style="
                      position: absolute;
                      left: 50%;
                      top: 0;
                      width: 2px;
                      height: 100%;
                      background: white;
                      margin-left: -1px;
                      z-index: 10;
                    "></div>
                  </div>
                  
                  <!-- 범례 -->
                  <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 0.875rem; color: #6b7280;">
                    <span>${dimension.leftType}</span>
                    <span>${dimension.rightType}</span>
                  </div>
                </div>

                <!-- 성향 설명 -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
                  <div style="
                    padding: 12px;
                    border-radius: 8px;
                    border: 2px solid ${isLeftDominant ? typeInfo.color : '#e5e7eb'};
                    background: ${isLeftDominant ? `${typeInfo.color}20` : '#f9fafb'};
                  ">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                      <div style="width: 12px; height: 12px; border-radius: 50%; background: ${isLeftDominant ? typeInfo.color : '#6b7280'};"></div>
                      <span style="font-weight: 500; color: #111827; font-size: 0.875rem;">${dimension.leftType}</span>
                      ${isLeftDominant ? `<span style="background: ${typeInfo.color}; color: white; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px;">주 성향</span>` : ''}
                    </div>
                    <p style="font-size: 0.875rem; color: #6b7280; line-height: 1.5; margin: 0;">${dimension.leftDesc}</p>
                  </div>
                  
                  <div style="
                    padding: 12px;
                    border-radius: 8px;
                    border: 2px solid ${!isLeftDominant ? typeInfo.color : '#e5e7eb'};
                    background: ${!isLeftDominant ? `${typeInfo.color}20` : '#f9fafb'};
                  ">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                      <div style="width: 12px; height: 12px; border-radius: 50%; background: ${!isLeftDominant ? typeInfo.color : '#6b7280'};"></div>
                      <span style="font-weight: 500; color: #111827; font-size: 0.875rem;">${dimension.rightType}</span>
                      ${!isLeftDominant ? `<span style="background: ${typeInfo.color}; color: white; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px;">주 성향</span>` : ''}
                    </div>
                    <p style="font-size: 0.875rem; color: #6b7280; line-height: 1.5; margin: 0;">${dimension.rightDesc}</p>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        
        <!-- 전체 요약 -->
        <div style="margin-top: 50px; margin-bottom: 40px; page-break-inside: avoid; width: 100%;">
          <div style="
            background: #f8fafc; 
            border-radius: 16px; 
            padding: 40px 32px 40px 32px; 
            text-align: center; 
            border: 2px solid #e5e7eb;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            width: 100%;
            box-sizing: border-box;
          ">
            <div style="
              width: 80px;
              height: 80px;
              margin: 0 auto 30px auto;
              border-radius: 50%;
              background: ${typeInfo.color};
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 1.5rem;
              font-weight: bold;
              box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.2);
            ">
              ${result.type}
            </div>
            
            <h3 style="
              font-size: 1.75rem; 
              font-weight: bold; 
              color: #111827; 
              margin-bottom: 30px;
              font-family: ${FONT_STACK};
              line-height: 1.2;
            ">종합 분석 결과</h3>
            
            <div style="
              color: #374151; 
              max-width: 700px; 
              margin: 0 auto; 
              line-height: 2.2; 
              font-size: 1.1rem; 
              word-break: keep-all; 
              white-space: normal;
              font-family: ${FONT_STACK};
              padding: 24px;
              background: rgba(255, 255, 255, 0.9);
              border-radius: 12px;
              border: 1px solid rgba(0, 0, 0, 0.1);
              box-sizing: border-box;
              width: 100%;
            ">
              <div style="margin-bottom: 20px; padding-bottom: 20px;">
                <p style="margin: 0; padding: 0; font-size: 1.1rem; line-height: 2.2;">
                  당신의 MBTI 성격 유형은 
                  <strong style="color: ${typeInfo.color}; font-weight: 700; font-size: 1.25rem;">${result.type}</strong>이며, 
                  결과의 신뢰도는 
                  <strong style="color: ${typeInfo.color}; font-weight: 700; font-size: 1.25rem;">${result.confidence}%</strong>입니다.
                </p>
              </div>
              <div style="padding-top: 20px;">
                <p style="margin: 0; padding: 0; font-size: 1.1rem; line-height: 2.2;">
                  각 차원의 성향이 균형 있게 나타나거나 한쪽으로 치우쳐 있는지 확인해보세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <div className="p-4 space-y-3">
      {/* 클립보드 복사 */}
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

      {/* 이미지 저장 */}
      <button
        onClick={handleGenerateImage}
        disabled={isGeneratingImage}
        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          {isGeneratingImage ? (
            <div className="relative">
              <div className="w-5 h-5 border-2 border-purple-200 rounded-full" />
              <div 
                className="absolute inset-0 w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"
              />
              {captureProgress > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">{Math.round(captureProgress)}</span>
                </div>
              )}
            </div>
          ) : (
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <div className="text-left flex-1">
          <div className="font-medium text-gray-900">
            {isGeneratingImage ? '전체 결과 생성 중...' : SHARE_TEXT.QUICK_ACTIONS.GENERATE_IMAGE.TITLE}
          </div>
          <div className="text-sm text-gray-600">
            {isGeneratingImage ? `진행률: ${Math.round(captureProgress)}%` : '모든 분석 결과를 이미지로 저장'}
          </div>
        </div>
      </button>
    </div>
  );
}; 