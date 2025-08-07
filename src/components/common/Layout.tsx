import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  title?: string;
  showHeader?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full' | 'container';
}

const Layout = ({
  children,
  className = '',
  title,
  showHeader = true,
  maxWidth = '4xl'
}: LayoutProps) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full',
    container: 'container'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {showHeader && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <motion.h1 
              className="text-2xl md:text-3xl font-bold text-gray-900 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {title || '교사 MBTI 수업 스타일 분석'}
            </motion.h1>
          </div>
        </header>
      )}
      
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          className={`w-full ${maxWidthClasses[maxWidth]} mx-auto ${className}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm md:text-base text-gray-500">
          교사 MBTI 수업 스타일 분석 © 2025
        </div>
      </footer>
    </div>
  );
};

export default Layout; 