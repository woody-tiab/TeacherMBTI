import { motion } from 'framer-motion';
import { MBTIQuestionOption } from '../../types/mbti';

interface AnswerButtonProps {
  option: MBTIQuestionOption;
  isSelected: boolean;
  onSelect: (option: MBTIQuestionOption) => void;
  index: number;
}

const AnswerButton = ({ option, isSelected, onSelect, index }: AnswerButtonProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(option)}
      className={`
        w-full p-4 md:p-6 text-left rounded-xl border-2 transition-all duration-300
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-lg' 
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
        }
      `}
      aria-pressed={isSelected}
      role="radio"
      aria-describedby={`option-${option.id}-description`}
    >
      <div className="flex items-start space-x-4">
        <div className={`
          flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
          ${isSelected 
            ? 'border-blue-500 bg-blue-500' 
            : 'border-gray-300 bg-white'
          }
        `}>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3 h-3 bg-white rounded-full"
            />
          )}
        </div>
        
        <div className="flex-1">
          <p 
            id={`option-${option.id}-description`}
            className={`
              text-base md:text-lg leading-relaxed transition-colors duration-200
              ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}
            `}
          >
            {option.text}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

export default AnswerButton; 