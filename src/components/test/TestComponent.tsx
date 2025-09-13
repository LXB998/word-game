import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearningStore } from '@/stores/learningStore';
import { TestGenerator } from '@/lib/learning';
import { sampleWords } from '@/data/words';
import { SketchCard, SketchButton, SketchProgress } from '@/components/sketch/SketchComponents';
import type { TestQuestion, TestResult } from '@/types';
import { cn } from '@/lib/utils';

interface TestComponentProps {
  onComplete?: (result: TestResult) => void;
  questionCount?: number;
  testType?: 'choice' | 'mixed';
}

export const TestComponent: React.FC<TestComponentProps> = ({
  onComplete,
  questionCount = 10,
  testType = 'mixed'
}) => {
  const {
    userProgress,
    startTest,
    answerQuestion,
    finishTest,
    currentTest,
    isTesting
  } = useLearningStore();

  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * questionCount); // 每题60秒
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    if (testStarted && isTesting && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isTesting) {
      handleFinishTest();
    }
  }, [testStarted, isTesting, timeLeft]);

  const startNewTest = () => {
    const testQuestions = TestGenerator.generateTest(
      sampleWords,
      questionCount,
      testType === 'mixed' ? ['choice', 'fill-blank', 'spelling'] : ['choice']
    );
    
    setQuestions(testQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setTimeLeft(60 * questionCount);
    setTestStarted(true);
    
    startTest({
      userId: userProgress?.userId || '',
      testType: testType,
      questions: testQuestions,
      answers: new Array(testQuestions.length).fill(''),
      score: 0,
      totalQuestions: testQuestions.length,
      timeSpent: 0
    });
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    answerQuestion(currentQuestionIndex, answer);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      handleFinishTest();
    }
  };

  const handleFinishTest = () => {
    finishTest();
    setShowResult(true);
    setTestStarted(false);
    
    if (onComplete && currentTest) {
      onComplete(currentTest);
    }
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🏆';
    if (score >= 80) return '⭐';
    if (score >= 70) return '👍';
    if (score >= 60) return '😊';
    return '💪';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!testStarted && !showResult) {
    return (
      <SketchCard className="max-w-2xl mx-auto p-8">
        <div className="text-center space-y-6">
          <div className="sketch-doodle text-6xl">🎯</div>
          <h2 className="sketch-font text-3xl font-bold">词汇测试</h2>
          <p className="sketch-font text-muted-foreground">
            测试你的词汇掌握程度
          </p>
          
          <div className="grid grid-cols-2 gap-4 my-8">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="sketch-font text-2xl font-bold text-primary">
                {questionCount}
              </div>
              <div className="sketch-font text-sm text-muted-foreground">
                题目数量
              </div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="sketch-font text-2xl font-bold text-primary">
                {formatTime(timeLeft)}
              </div>
              <div className="sketch-font text-sm text-muted-foreground">
                总时间
              </div>
            </div>
          </div>
          
          <SketchButton onClick={startNewTest} size="lg">
            🚀 开始测试
          </SketchButton>
        </div>
      </SketchCard>
    );
  }

  if (showResult && currentTest) {
    const accuracy = Math.round((currentTest.score / 100) * currentTest.totalQuestions);
    const timeSpentMinutes = Math.floor(currentTest.timeSpent / 60);
    
    return (
      <SketchCard className="max-w-2xl mx-auto p-8">
        <div className="text-center space-y-6">
          <div className="sketch-doodle text-6xl">
            {getScoreEmoji(currentTest.score)}
          </div>
          <h2 className="sketch-font text-3xl font-bold">测试完成！</h2>
          
          <div className={cn(
            'sketch-font text-6xl font-bold',
            getScoreColor(currentTest.score)
          )}>
            {currentTest.score}分
          </div>
          
          <div className="grid grid-cols-3 gap-4 my-8">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="sketch-font text-xl font-bold">
                {accuracy}/{currentTest.totalQuestions}
              </div>
              <div className="sketch-font text-sm text-muted-foreground">
                正确题数
              </div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="sketch-font text-xl font-bold">
                {Math.round(currentTest.score)}%
              </div>
              <div className="sketch-font text-sm text-muted-foreground">
                准确率
              </div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="sketch-font text-xl font-bold">
                {timeSpentMinutes}分钟
              </div>
              <div className="sketch-font text-sm text-muted-foreground">
                用时
              </div>
            </div>
          </div>
          
          <div className="text-left space-y-4">
            <h3 className="sketch-font text-lg font-semibold">答题详情：</h3>
            {currentTest.questions.map((question, index) => {
              const isCorrect = currentTest.answers[index] === question.correctAnswer;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg"
                >
                  <span className="text-lg">{isCorrect ? '✅' : '❌'}</span>
                  <div className="flex-1">
                    <div className="sketch-font text-sm">
                      {index + 1}. {question.question}
                    </div>
                    <div className="sketch-font text-xs text-muted-foreground">
                      你的答案：{currentTest.answers[index] || '未作答'}
                      {!isCorrect && ` | 正确答案：${question.correctAnswer}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-4 justify-center">
            <SketchButton onClick={startNewTest}>
              🔄 再测一次
            </SketchButton>
            <SketchButton variant="outline" onClick={() => setShowResult(false)}>
              📊 返回
            </SketchButton>
          </div>
        </div>
      </SketchCard>
    );
  }

  if (testStarted && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    
    return (
      <SketchCard className="max-w-2xl mx-auto p-8">
        {/* 测试头部 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="sketch-font text-xl font-bold">词汇测试</h2>
            <div className="flex items-center gap-4">
              <span className="sketch-font text-sm text-muted-foreground">
                ⏰ {formatTime(timeLeft)}
              </span>
              <span className="sketch-font text-sm text-muted-foreground">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
          </div>
          
          <SketchProgress
            value={progress}
            label="测试进度"
            variant="pencil"
          />
        </div>
        
        {/* 题目 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="sketch-font text-lg font-semibold mb-4">
                {currentQuestion.question}
              </h3>
              
              {currentQuestion.type === 'choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'w-full p-4 text-left sketch-border rounded-lg transition-all',
                        selectedAnswer === option 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-card hover:bg-muted/50'
                      )}
                      onClick={() => handleAnswerSelect(option)}
                    >
                      <span className="sketch-font">
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}
              
              {(currentQuestion.type === 'fill-blank' || currentQuestion.type === 'spelling') && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={selectedAnswer}
                    onChange={(e) => handleAnswerSelect(e.target.value)}
                    placeholder="请输入答案..."
                    className="sketch-input w-full px-4 py-3 text-center sketch-font text-lg"
                    autoFocus
                  />
                  {currentQuestion.type === 'spelling' && (
                    <p className="sketch-font text-sm text-muted-foreground">
                      💡 提示：注意拼写准确性和大小写
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* 导航按钮 */}
            <div className="flex justify-between items-center">
              <SketchButton
                variant="outline"
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                    setSelectedAnswer(currentTest?.answers[currentQuestionIndex - 1] || '');
                  }
                }}
                disabled={currentQuestionIndex === 0}
              >
                ← 上一题
              </SketchButton>
              
              <SketchButton
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
              >
                {currentQuestionIndex === questions.length - 1 ? '完成测试' : '下一题 →'}
              </SketchButton>
            </div>
          </motion.div>
        </AnimatePresence>
      </SketchCard>
    );
  }

  return null;
};