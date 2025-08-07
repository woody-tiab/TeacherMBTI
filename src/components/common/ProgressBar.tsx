import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100 사이의 진행률
  className?: string;
  showPercentage?: boolean;
  label?: string;
  color?: 'blue' | 'green' | 'purple' | 'pink';
}

const ProgressBar = ({
  progress,
  className = '',
  showPercentage = true,
  label,
  color = 'blue'
}: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    pink: 'bg-pink-600'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorClasses[color]}`}
          role="progressbar"
          aria-valuenow={Math.round(clampedProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || `진행률: ${Math.round(clampedProgress)}%`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut" 
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar; 