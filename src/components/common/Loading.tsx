import { FC } from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

const Loading: FC<LoadingProps> = ({ 
  message = '로딩 중...', 
  size = 'md', 
  fullScreen = false,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { spinner: 'w-6 h-6', text: 'text-sm' };
      case 'lg':
        return { spinner: 'w-12 h-12', text: 'text-lg' };
      default:
        return { spinner: 'w-8 h-8', text: 'text-base' };
    }
  };

  const sizeClasses = getSizeClasses();

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50"
    : `flex items-center justify-center p-8 ${className}`;

  return (
    <div 
      className={containerClasses}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center space-y-4">
        {/* 회전하는 스피너 */}
        <motion.div
          className={`border-4 border-blue-200 border-t-blue-600 rounded-full ${sizeClasses.spinner}`}
          variants={spinnerVariants}
          animate="animate"
        />
        
        {/* 로딩 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`text-gray-600 ${sizeClasses.text} font-medium flex items-center space-x-1`}
        >
          <span>{message}</span>
          <div className="flex space-x-1 ml-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-1 h-1 bg-blue-600 rounded-full"
                variants={dotVariants}
                animate="animate"
                transition={{
                  delay: index * 0.5,
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Loading; 