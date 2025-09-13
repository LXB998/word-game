import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLearningStore } from '@/stores/learningStore';
import { TestComponent } from '@/components/test/TestComponent';
import { SketchCard, SketchButton } from '@/components/sketch/SketchComponents';

export const TestPage: React.FC = () => {
  const { words, userProgress } = useLearningStore();
  const [testSession, setTestSession] = useState<{
    isActive: boolean;
    questionCount: number;
    testType: 'choice' | 'spelling' | 'definition';
  }>({
    isActive: false,
    questionCount: 10,
    testType: 'choice'
  });

  const startTest = (questionCount: number, testType: 'choice' | 'spelling' | 'definition') => {
    setTestSession({
      isActive: true,
      questionCount,
      testType
    });
  };

  const endTest = () => {
    setTestSession({
      isActive: false,
      questionCount: 10,
      testType: 'choice'
    });
  };

  if (testSession.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-green-50/30">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <TestComponent
              questionCount={testSession.questionCount}
              testType={testSession.testType}
              onComplete={(result) => {
                console.log('Test completed:', result);
                endTest();
              }}
              onExit={endTest}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-green-50/30">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-10 sketch-doodle">🎯</div>
        <div className="absolute top-20 right-20 text-4xl opacity-10 sketch-doodle">📝</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 sketch-doodle">🏆</div>
        <div className="absolute bottom-10 right-10 text-3xl opacity-10 sketch-doodle">⭐</div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="sketch-font text-4xl font-bold text-foreground mb-4">
            🎯 词汇测试
          </h1>
          <p className="sketch-font text-lg text-muted-foreground">
            选择测试模式，检验你的学习成果
          </p>
        </motion.header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 选择题测试 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SketchCard className="p-8 h-full">
              <div className="text-center mb-6">
                <div className="sketch-doodle text-6xl mb-4">📋</div>
                <h3 className="sketch-font text-2xl font-bold mb-2">
                  选择题测试
                </h3>
                <p className="sketch-font text-muted-foreground text-sm">
                  从四个选项中选择正确的意思
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="sketch-font text-sm text-muted-foreground mb-2">
                    题目数量
                  </div>
                  <div className="flex justify-center gap-2">
                    {[5, 10, 20].map(count => (
                      <SketchButton
                        key={count}
                        onClick={() => startTest(count, 'choice')}
                        size="sm"
                        variant={count === 10 ? 'primary' : 'outline'}
                      >
                        {count}题
                      </SketchButton>
                    ))}
                  </div>
                </div>
                
                <SketchButton
                  onClick={() => startTest(10, 'choice')}
                  className="w-full"
                  size="lg"
                >
                  🚀 开始选择题测试
                </SketchButton>
              </div>
            </SketchCard>
          </motion.div>

          {/* 拼写测试 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SketchCard className="p-8 h-full">
              <div className="text-center mb-6">
                <div className="sketch-doodle text-6xl mb-4">✏️</div>
                <h3 className="sketch-font text-2xl font-bold mb-2">
                  拼写测试
                </h3>
                <p className="sketch-font text-muted-foreground text-sm">
                  根据中文意思拼写英文单词
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="sketch-font text-sm text-muted-foreground mb-2">
                    题目数量
                  </div>
                  <div className="flex justify-center gap-2">
                    {[5, 10, 15].map(count => (
                      <SketchButton
                        key={count}
                        onClick={() => startTest(count, 'spelling')}
                        size="sm"
                        variant={count === 10 ? 'primary' : 'outline'}
                      >
                        {count}题
                      </SketchButton>
                    ))}
                  </div>
                </div>
                
                <SketchButton
                  onClick={() => startTest(10, 'spelling')}
                  className="w-full"
                  size="lg"
                  variant="secondary"
                >
                  📝 开始拼写测试
                </SketchButton>
              </div>
            </SketchCard>
          </motion.div>

          {/* 定义测试 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SketchCard className="p-8 h-full">
              <div className="text-center mb-6">
                <div className="sketch-doodle text-6xl mb-4">📖</div>
                <h3 className="sketch-font text-2xl font-bold mb-2">
                  定义测试
                </h3>
                <p className="sketch-font text-muted-foreground text-sm">
                  根据英文单词选择中文定义
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="sketch-font text-sm text-muted-foreground mb-2">
                    题目数量
                  </div>
                  <div className="flex justify-center gap-2">
                    {[5, 10, 20].map(count => (
                      <SketchButton
                        key={count}
                        onClick={() => startTest(count, 'definition')}
                        size="sm"
                        variant={count === 10 ? 'primary' : 'outline'}
                      >
                        {count}题
                      </SketchButton>
                    ))}
                  </div>
                </div>
                
                <SketchButton
                  onClick={() => startTest(10, 'definition')}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  🎯 开始定义测试
                </SketchButton>
              </div>
            </SketchCard>
          </motion.div>
        </div>

        {/* 学习统计预览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <SketchCard className="p-6">
            <h3 className="sketch-font text-xl font-bold mb-4 text-center">
              📊 当前学习状态
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="sketch-font text-2xl font-bold text-primary">
                  {userProgress?.totalWords || 0}
                </div>
                <div className="sketch-font text-sm text-muted-foreground">总词汇</div>
              </div>
              <div className="text-center">
                <div className="sketch-font text-2xl font-bold text-green-600">
                  {userProgress?.masteredWords?.length || 0}
                </div>
                <div className="sketch-font text-sm text-muted-foreground">已掌握</div>
              </div>
              <div className="text-center">
                <div className="sketch-font text-2xl font-bold text-blue-600">
                  {userProgress?.totalExp || 0}
                </div>
                <div className="sketch-font text-sm text-muted-foreground">经验值</div>
              </div>
              <div className="text-center">
                <div className="sketch-font text-2xl font-bold text-orange-600">
                  {userProgress?.streak || 0}
                </div>
                <div className="sketch-font text-sm text-muted-foreground">连续天数</div>
              </div>
            </div>
          </SketchCard>
        </motion.div>
      </div>
    </div>
  );
};