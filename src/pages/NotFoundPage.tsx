import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout, Button, Card } from '../components/common';

const NotFoundPage: React.FC = () => {
  return (
    <Layout title="페이지를 찾을 수 없습니다" maxWidth="lg">
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <Card className="text-center bg-gradient-to-br from-gray-50 to-blue-50 border-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="text-8xl mb-6"
            >
              🤔
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl font-bold text-gray-800 mb-4"
            >
              404
            </motion.h1>
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4"
            >
              페이지를 찾을 수 없습니다
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed"
            >
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
              <br />
              아래 버튼을 통해 다른 페이지로 이동해보세요.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="px-8 py-3"
                >
                  🏠 홈으로 가기
                </Button>
              </Link>
              
              <Link to="/test">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-3"
                >
                  📝 테스트 시작하기
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <p className="text-sm md:text-base text-gray-500 break-korean">
                문제가 지속되면 브라우저를 새로고침하거나 잠시 후 다시 시도해주세요.
              </p>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFoundPage; 