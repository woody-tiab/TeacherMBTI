import { motion } from 'framer-motion';
import { MBTIQuestion, MBTIQuestionOption, MBTIAnswer } from '../../types/mbti';
import AnswerButton from './AnswerButton';
import Card from '../common/Card';

interface QuestionCardProps {
  question: MBTIQuestion;
  currentAnswer?: MBTIAnswer;
  onAnswerSelect: (option: MBTIQuestionOption) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard = ({ 
  question, 
  currentAnswer, 
  onAnswerSelect, 
  questionNumber, 
  totalQuestions 
}: QuestionCardProps) => {
  const handleOptionSelect = (option: MBTIQuestionOption) => {
    onAnswerSelect(option);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="space-y-6">
        {/* 질문 헤더 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {question.category}
            </span>
            <span className="text-sm md:text-base text-gray-500">
              {questionNumber} / {totalQuestions}
            </span>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed break-korean"
            id={`question-${question.id}-title`}
          >
            {question.text}
          </motion.h2>
        </div>

        {/* 답변 옵션들 */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
          role="radiogroup"
          aria-labelledby={`question-${question.id}-title`}
        >
          {question.options.map((option, index) => (
            <AnswerButton
              key={option.id}
              option={option}
              isSelected={currentAnswer?.selectedOptionId === option.id}
              onSelect={handleOptionSelect}
              index={index}
            />
          ))}
        </motion.div>

        {/* 답변 완료 표시 */}
        {currentAnswer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-200"
          >
            <div className="flex items-center space-x-2 text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="text-sm md:text-base font-medium">답변 완료</span>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default QuestionCard; 