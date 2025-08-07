import { motion } from 'framer-motion';
import { MBTIResult, MBTITypeInfo } from '../../types/mbti';
import ResultCard from './ResultCard';
import TypeDescription from './TypeDescription';
import TeachingStyleInfo from './TeachingStyleInfo';
import ScoreChart from './ScoreChart';

interface CompleteResultsProps {
  result: MBTIResult;
  typeInfo: MBTITypeInfo;
}

const CompleteResults = ({ result, typeInfo }: CompleteResultsProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4" data-share-image="complete-results">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          교사 MBTI 분석 결과
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          당신의 교육 스타일과 성격 특성을 종합적으로 분석한 결과입니다
        </p>
      </motion.div>

      {/* 전체 섹션을 세로로 배치 */}
      <div className="space-y-8">
        {/* 1. 결과 개요 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📊</span>
              결과 개요
            </h2>
          </div>
          <ResultCard result={result} typeInfo={typeInfo} />
        </motion.div>

        {/* 2. 상세 분석 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📋</span>
              상세 분석
            </h2>
          </div>
          <TypeDescription typeInfo={typeInfo} />
        </motion.div>

        {/* 3. 교육 스타일 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="mr-2">🎯</span>
              교육 스타일
            </h2>
          </div>
          <TeachingStyleInfo typeInfo={typeInfo} />
        </motion.div>

        {/* 4. 성향 차트 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📈</span>
              성향 분석
            </h2>
          </div>
          <ScoreChart result={result} typeColor={typeInfo.color} />
        </motion.div>
      </div>

      {/* 브랜딩 정보 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <div className="bg-white bg-opacity-80 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">
            🎯 교사 MBTI 수업 스타일 분석 | 나만의 교육 스타일을 확인해보세요
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CompleteResults;