import { Component, ReactNode, ErrorInfo } from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from './index';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg"
          >
            <Card className="text-center bg-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="text-6xl mb-6"
              >
                😵
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-2xl font-bold text-gray-800 mb-4"
              >
                앗! 문제가 발생했습니다
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-gray-600 mb-8 leading-relaxed"
              >
                예상치 못한 오류가 발생했습니다.
                <br />
                페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button 
                  variant="primary" 
                  onClick={this.handleReload}
                  className="px-6 py-2"
                >
                  🔄 페이지 새로고침
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={this.handleReset}
                  className="px-6 py-2"
                >
                  🔧 다시 시도
                </Button>
              </motion.div>
              
              {this.state.error && (
                <motion.details
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  className="mt-8 text-left"
                >
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    개발자 정보 (클릭하여 펼치기)
                  </summary>
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs font-mono text-gray-700 overflow-auto max-h-40">
                    <div className="mb-2 font-semibold">Error:</div>
                    <div className="mb-4">{this.state.error.message}</div>
                    <div className="mb-2 font-semibold">Stack:</div>
                    <div>{this.state.error.stack}</div>
                  </div>
                </motion.details>
              )}
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 