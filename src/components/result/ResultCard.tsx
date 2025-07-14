import { motion } from 'framer-motion';
import { MBTIResult, MBTITypeInfo } from '../../types/mbti';
import Card from '../common/Card';

interface ResultCardProps {
  result: MBTIResult;
  typeInfo: MBTITypeInfo;
}

const ResultCard = ({ result, typeInfo }: ResultCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="relative overflow-hidden" data-share-image>
        {/* 배경 그라데이션 */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(135deg, ${typeInfo.color} 0%, ${typeInfo.color}80 100%)`
          }}
        />
        
        {/* 메인 콘텐츠 */}
        <div className="relative z-10 space-y-6 p-8">
          {/* 타입 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center justify-center space-x-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                style={{ backgroundColor: typeInfo.color }}
              >
                {result.type}
              </div>
              <div className="text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {typeInfo.nickname}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  교사 MBTI 유형
                </p>
              </div>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto"
            >
              {typeInfo.description}
            </motion.p>
          </motion.div>

          {/* 신뢰도 표시 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white bg-opacity-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">결과 신뢰도</span>
              <span className="text-sm font-bold text-gray-900">{result.confidence}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: typeInfo.color }}
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {result.confidence >= 80 
                ? "매우 높은 신뢰도의 결과입니다" 
                : result.confidence >= 60
                ? "적정 수준의 신뢰도입니다"
                : "추가적인 분석이 도움될 수 있습니다"
              }
            </p>
          </motion.div>

          {/* 4차원 점수 요약 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { 
                dimension: 'E/I', 
                score: result.percentages.EI, 
                label: result.percentages.EI > 50 ? '외향형 (E)' : '내향형 (I)',
                value: result.percentages.EI > 50 ? result.percentages.EI : 100 - result.percentages.EI
              },
              { 
                dimension: 'S/N', 
                score: result.percentages.SN, 
                label: result.percentages.SN > 50 ? '감각형 (S)' : '직관형 (N)',
                value: result.percentages.SN > 50 ? result.percentages.SN : 100 - result.percentages.SN
              },
              { 
                dimension: 'T/F', 
                score: result.percentages.TF, 
                label: result.percentages.TF > 50 ? '사고형 (T)' : '감정형 (F)',
                value: result.percentages.TF > 50 ? result.percentages.TF : 100 - result.percentages.TF
              },
              { 
                dimension: 'J/P', 
                score: result.percentages.JP, 
                label: result.percentages.JP > 50 ? '판단형 (J)' : '인식형 (P)',
                value: result.percentages.JP > 50 ? result.percentages.JP : 100 - result.percentages.JP
              }
            ].map((item) => (
              <div key={item.dimension} className="bg-white bg-opacity-60 rounded-lg p-4 text-center border border-gray-200">
                <div className="text-sm font-medium text-gray-600 mb-1">{item.dimension}</div>
                <div className="text-xs text-gray-700 mb-2">{item.label}</div>
                <div className="text-2xl font-bold" style={{ color: typeInfo.color }}>
                  {Math.round(item.value)}%
                </div>
              </div>
            ))}
          </motion.div>

          {/* 공유용 브랜딩 (이미지 생성시에만 표시) */}
          <div className="hidden print:block bg-white bg-opacity-70 rounded-lg p-3 text-center border border-gray-200">
            <p className="text-sm text-gray-600">
              🎯 교사 MBTI 수업 스타일 분석 | 나만의 교육 스타일을 확인해보세요
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ResultCard; 