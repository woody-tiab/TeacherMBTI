import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { MBTIResult } from '../../types/mbti';
import Card from '../common/Card';

interface ScoreChartProps {
  result: MBTIResult;
  typeColor: string;
}

const ScoreChart = ({ result, typeColor }: ScoreChartProps) => {
  const dimensions = useMemo(() => [
    {
      name: "에너지 방향",
      leftType: "내향형 (I)",
      rightType: "외향형 (E)",
      leftDesc: "내면의 세계에 집중하며 깊이 있는 상호작용을 선호",
      rightDesc: "외부 세계와의 활발한 소통과 에너지 교환을 선호",
      percentage: result.percentages.EI,
      leftValue: 100 - result.percentages.EI,
      rightValue: result.percentages.EI,
      color: typeColor
    },
    {
      name: "정보 수집",
      leftType: "감각형 (S)",
      rightType: "직관형 (N)",
      leftDesc: "구체적이고 실질적인 정보와 경험을 중시",
      rightDesc: "가능성과 패턴, 미래 지향적 아이디어를 중시",
      percentage: result.percentages.SN,
      leftValue: 100 - result.percentages.SN,
      rightValue: result.percentages.SN,
      color: typeColor
    },
    {
      name: "판단 기준",
      leftType: "사고형 (T)",
      rightType: "감정형 (F)",
      leftDesc: "논리적 분석과 객관적 기준을 바탕으로 판단",
      rightDesc: "가치관과 사람들의 감정을 고려한 판단",
      percentage: result.percentages.TF,
      leftValue: 100 - result.percentages.TF,
      rightValue: result.percentages.TF,
      color: typeColor
    },
    {
      name: "생활 양식",
      leftType: "판단형 (J)",
      rightType: "인식형 (P)",
      leftDesc: "계획적이고 체계적인 접근을 선호",
      rightDesc: "유연하고 적응적인 접근을 선호",
      percentage: result.percentages.JP,
      leftValue: 100 - result.percentages.JP,
      rightValue: result.percentages.JP,
      color: typeColor
    }
  ], [result.percentages, typeColor]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          MBTI 4차원 성격 분석
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          각 차원별 성향의 비율과 특성을 자세히 살펴보세요
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
        role="group"
        aria-label="MBTI 4차원 성격 분석 차트"
      >
        {dimensions.map((dimension, index) => {
          const isLeftDominant = dimension.leftValue > dimension.rightValue;
          
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="space-y-4">
                  {/* 차원 제목 */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {dimension.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <span className={isLeftDominant ? "font-semibold" : ""}>
                        {dimension.leftType}
                      </span>
                      <span>vs</span>
                      <span className={!isLeftDominant ? "font-semibold" : ""}>
                        {dimension.rightType}
                      </span>
                    </div>
                  </div>

                  {/* 시각적 막대 그래프 */}
                  <div className="relative">
                    {/* 배경 막대 */}
                    <div 
                      className="w-full h-12 bg-gray-200 rounded-full relative overflow-hidden"
                      role="img"
                      aria-label={`${dimension.name} 차원: ${dimension.leftType} ${Math.round(dimension.leftValue)}%, ${dimension.rightType} ${Math.round(dimension.rightValue)}%`}
                    >
                      {/* 왼쪽 (첫 번째 성향) */}
                      <motion.div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-gray-400 to-gray-500"
                        initial={{ width: "50%" }}
                        animate={{ width: `${dimension.leftValue}%` }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 + index * 0.2 }}
                        aria-label={`${dimension.leftType}: ${Math.round(dimension.leftValue)}%`}
                      >
                        {dimension.leftValue > 20 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-medium text-sm whitespace-nowrap" aria-live="polite">
                              {Math.round(dimension.leftValue)}%
                            </span>
                          </div>
                        )}
                      </motion.div>

                      {/* 오른쪽 (두 번째 성향) */}
                      <motion.div
                        className="absolute right-0 top-0 h-full"
                        style={{ 
                          background: `linear-gradient(to left, ${typeColor}, ${typeColor}88)`
                        }}
                        initial={{ width: "50%" }}
                        animate={{ width: `${dimension.rightValue}%` }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 + index * 0.2 }}
                        aria-label={`${dimension.rightType}: ${Math.round(dimension.rightValue)}%`}
                      >
                        {dimension.rightValue > 20 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-medium text-sm whitespace-nowrap" aria-live="polite">
                              {Math.round(dimension.rightValue)}%
                            </span>
                          </div>
                        )}
                      </motion.div>

                      {/* 중앙 구분선 */}
                      <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white transform -translate-x-1/2 z-10" />
                    </div>

                    {/* 범례 */}
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>{dimension.leftType}</span>
                      <span>{dimension.rightType}</span>
                    </div>
                  </div>

                  {/* 성향 설명 */}
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className={`p-3 rounded-lg border-2 ${
                        isLeftDominant 
                          ? 'bg-gray-50 border-gray-300' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-gray-500" />
                        <span className="font-medium text-gray-900">
                          {dimension.leftType}
                        </span>
                        {isLeftDominant && (
                          <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded-full">
                            주 성향
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {dimension.leftDesc}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className={`p-3 rounded-lg border-2 ${
                        !isLeftDominant 
                          ? 'border-2' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      style={{
                        backgroundColor: !isLeftDominant ? `${typeColor}20` : undefined,
                        borderColor: !isLeftDominant ? typeColor : undefined
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: typeColor }}
                        />
                        <span className="font-medium text-gray-900">
                          {dimension.rightType}
                        </span>
                        {!isLeftDominant && (
                          <span 
                            className="text-xs text-white px-2 py-1 rounded-full"
                            style={{ backgroundColor: typeColor }}
                          >
                            주 성향
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {dimension.rightDesc}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* 전체 요약 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="text-center space-y-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg"
            style={{ backgroundColor: typeColor }}
          >
            {result.type}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900">
            종합 분석 결과
          </h3>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            당신의 MBTI 성격 유형은 <strong>{result.type}</strong>이며, 
            결과의 신뢰도는 <strong>{result.confidence}%</strong>입니다. 
            각 차원의 성향이 균형 있게 나타나거나 한쪽으로 치우쳐 있는지 확인해보세요.
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default ScoreChart; 