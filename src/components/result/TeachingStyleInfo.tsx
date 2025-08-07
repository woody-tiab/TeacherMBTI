import { motion } from 'framer-motion';
import { MBTITypeInfo } from '../../types/mbti';
import Card from '../common/Card';

interface TeachingStyleInfoProps {
  typeInfo: MBTITypeInfo;
}

const TeachingStyleInfo = ({ typeInfo }: TeachingStyleInfoProps) => {
  const { teachingStyle } = typeInfo;

  const styleAspects = [
    {
      title: "전체적인 교육 철학",
      content: teachingStyle.overview,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-label="교육 철학 아이콘">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "학급 운영 방식",
      content: teachingStyle.classroomManagement,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-label="학급 운영 아이콘">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
      color: "from-green-500 to-teal-600"
    },
    {
      title: "교수법 및 수업 진행",
      content: teachingStyle.instructionMethod,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-label="교수법 아이콘">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>
      ),
      color: "from-orange-500 to-red-600"
    },
    {
      title: "학생과의 상호작용",
      content: teachingStyle.studentInteraction,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-label="학생 상호작용 아이콘">
          <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "평가 및 피드백 방식",
      content: teachingStyle.assessment,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-label="평가 및 피드백 아이콘">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
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
          당신의 교사 수업 스타일
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          MBTI 성향에 따른 구체적인 교육 방식과 학급 운영 특성을 알아보세요
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {styleAspects.map((aspect, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                {/* 배경 그라데이션 */}
                <div 
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${aspect.color}`}
                />
                
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* 아이콘 */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r ${aspect.color} flex items-center justify-center text-white shadow-lg`}>
                      {aspect.icon}
                    </div>
                    
                    {/* 콘텐츠 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {aspect.title}
                      </h3>
                      
                      <motion.p 
                        className="text-gray-700 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        {aspect.content}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* 추가 인사이트 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="text-center space-y-4">
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: typeInfo.color }}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900">
            {typeInfo.nickname}만의 특별한 교육 방식
          </h3>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            이러한 특성들이 조화롭게 어우러져 당신만의 독특하고 효과적인 교육 스타일을 만들어냅니다. 
            강점을 더욱 발전시키고 개선 영역에 관심을 기울인다면 더욱 탁월한 교육자가 될 수 있습니다.
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default TeachingStyleInfo; 