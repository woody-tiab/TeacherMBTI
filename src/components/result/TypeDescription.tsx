import { motion } from 'framer-motion';
import { MBTITypeInfo } from '../../types/mbti';
import Card from '../common/Card';

interface TypeDescriptionProps {
  typeInfo: MBTITypeInfo;
}

const TypeDescription = ({ typeInfo }: TypeDescriptionProps) => {
  // 에러 핸들링: typeInfo나 필수 속성들이 없는 경우 대체 UI 표시
  if (!typeInfo || !typeInfo.strengths || !typeInfo.weaknesses || !typeInfo.tips || !typeInfo.compatibleStudentTypes) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="text-center p-8 border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="오류 아이콘">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            데이터를 불러올 수 없습니다
          </h3>
          <p className="text-gray-600">
            분석 정보가 올바르지 않습니다. 다시 테스트를 진행해주세요.
          </p>
        </Card>
      </div>
    );
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* 강점 섹션 */}
      <motion.div variants={itemVariants}>
        <Card className="space-y-4 border-2 border-white bg-white">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: typeInfo.color }}
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-label="강점 아이콘">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">교육자로서의 강점</h3>
          </div>
          
          <ul className="grid md:grid-cols-2 gap-4" role="list">
            {typeInfo.strengths.map((strength, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span className="text-gray-700 leading-relaxed">{strength}</span>
              </motion.li>
            ))}
          </ul>
        </Card>
      </motion.div>

      {/* 약점 및 개선 영역 섹션 */}
      <motion.div variants={itemVariants}>
        <Card className="space-y-4 border-2 border-white bg-white">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#f97316' }}
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-label="개선영역 아이콘">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">개선이 필요한 영역</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {typeInfo.weaknesses.map((weakness, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#f97316' }} />
                <span className="text-gray-700 leading-relaxed">{weakness}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* 개선 팁 섹션 */}
      <motion.div variants={itemVariants}>
        <Card className="space-y-4 border-2 border-white bg-white">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#3b82f6' }}
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-label="팁 아이콘">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">성장을 위한 실용적 팁</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {typeInfo.tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#3b82f6' }} />
                <span className="text-gray-700 leading-relaxed">{tip}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* 적합한 학생 유형 섹션 */}
      <motion.div variants={itemVariants}>
        <Card className="space-y-4 border-2 border-white bg-white">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: typeInfo.color }}
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-label="학생 유형 아이콘">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">잘 맞는 학생 유형</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {typeInfo.compatibleStudentTypes.map((studentType, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200"
              >
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: typeInfo.color }} />
                <span className="text-gray-700 leading-relaxed">{studentType}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default TypeDescription; 