import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  titleClassName?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

const Card = ({
  children,
  className = '',
  title,
  subtitle,
  titleClassName,
  padding = 'md',
  shadow = 'md',
  hover = false,
  onClick
}: CardProps) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const baseClasses = `bg-white rounded-xl border border-gray-200 ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`;
  
  const motionProps = {
    whileHover: hover ? { scale: 1.02, y: -4 } : {},
    transition: { type: "spring", stiffness: 300, damping: 20 }
  };

  const CardContent = (
    <>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className={titleClassName || "text-lg md:text-xl font-semibold text-gray-900 mb-1"}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </>
  );

  // hover가 true일 때만 motion.div 사용
  if (hover) {
    return (
      <motion.div
        className={`${baseClasses} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
        {...motionProps}
      >
        {CardContent}
      </motion.div>
    );
  }

  // onClick만 있고 hover가 false일 때는 일반 div 사용
  if (onClick) {
    return (
      <div
        className={`${baseClasses} cursor-pointer`}
        onClick={onClick}
      >
        {CardContent}
      </div>
    );
  }

  // 기본적인 정적 카드
  return (
    <div className={baseClasses}>
      {CardContent}
    </div>
  );
};

export default Card; 