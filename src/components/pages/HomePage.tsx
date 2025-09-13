import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLearningStore } from '@/stores/learningStore';
import { SketchCard, SketchProgress, SketchButton } from '@/components/sketch/SketchComponents';
import { SketchWordCard } from '@/components/sketch/SketchWordCard';
import { sampleWords } from '@/data/words';

export const HomePage: React.FC = () => {
  const {
    userProgress,
    userSettings,
    learningStats,
    initializeUser,
    setCurrentWord,
    setSessionWords,
    startLearning,
    markWordAsLearned,
    addLearningRecord
  } = useLearningStore();

  const [currentSessionWords, setCurrentSessionWords] = useState(sampleWords.slice(0, 5));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    if (!userProgress) {
      initializeUser();
    }
  }, [userProgress, initializeUser]);

  const startLearningSession = () => {
    setSessionWords(currentSessionWords);
    setCurrentWord(currentSessionWords[0]);
    startLearning();
  };

  const handleWordMark = (status: 'known' | 'unknown' | 'learning') => {
    const currentWord = currentSessionWords[currentWordIndex];
    if (!currentWord) return;

    // 记录学习
    addLearningRecord({
      wordId: currentWord.id,
      userId: userProgress?.userId || '',
      action: 'learned',
      correct: status === 'known',
      timeSpent: 10,
      difficulty: currentWord.difficulty
    });

    if (status === 'known') {
      markWordAsLearned(currentWord.id);
    }

    // 下一个单词
    if (currentWordIndex < currentSessionWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentWord(currentSessionWords[currentWordIndex + 1]);
    } else {
      // 学习完成
      setCurrentWord(null);
      setCurrentWordIndex(0);
    }
  };

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return '🌱';
    if (streak < 3) return '🔥';
    if (streak < 7) return '💪';
    if (streak < 14) return '⭐';
    return '👑';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-blue-50/30 to-green-50/30">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-10 sketch-doodle">📚</div>
        <div className="absolute top-20 right-20 text-4xl opacity-10 sketch-doodle">✏️</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 sketch-doodle">📖</div>
        <div className="absolute bottom-10 right-10 text-3xl opacity-10 sketch-doodle">🎯</div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* 头部 */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="sketch-font text-6xl font-bold text-foreground mb-2">
            乐记单词
          </h1>
          <p className="sketch-font text-xl text-muted-foreground">
            素描风格的背单词工具
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧 - 学习统计 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* 学习进度卡片 */}
            <SketchCard className="p-6">
              <h2 className="sketch-font text-2xl font-bold mb-4 flex items-center gap-2">
                {getStreakEmoji(userProgress?.streak || 0)}
                学习进度
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="sketch-font">今日目标</span>
                  <span className="sketch-font text-lg font-semibold">
                    {userProgress?.learnedWords.length || 0} / {userSettings?.dailyGoal || 20}
                  </span>
                </div>
                
                <SketchProgress
                  value={userProgress?.learnedWords.length || 0}
                  max={userSettings?.dailyGoal || 20}
                  label="今日进度"
                  variant="pencil"
                />

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="sketch-font text-2xl font-bold text-primary">
                      {userProgress?.totalWords || 0}
                    </div>
                    <div className="sketch-font text-sm text-muted-foreground">
                      总词汇
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="sketch-font text-2xl font-bold text-green-600">
                      {userProgress?.streak || 0}
                    </div>
                    <div className="sketch-font text-sm text-muted-foreground">
                      连续天数
                    </div>
                  </div>
                </div>
              </div>
            </SketchCard>

            {/* 快速操作 */}
            <SketchCard className="p-6">
              <h3 className="sketch-font text-xl font-bold mb-4">
                快速开始
              </h3>
              <div className="space-y-3">
                <SketchButton
                  onClick={startLearningSession}
                  className="w-full"
                  disabled={!userProgress}
                >
                  📖 开始学习
                </SketchButton>
                <SketchButton
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  🎯 水平测试
                </SketchButton>
                <SketchButton
                  variant="secondary"
                  className="w-full"
                  disabled
                >
                  📊 学习报告
                </SketchButton>
              </div>
            </SketchCard>
          </motion.div>

          {/* 中间 - 主要学习区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <SketchCard className="p-8 min-h-[600px]">
              {!userProgress ? (
                <div className="text-center py-20">
                  <div className="sketch-doodle text-6xl mb-4">⏳</div>
                  <h2 className="sketch-font text-2xl font-bold mb-4">
                    正在准备学习环境...
                  </h2>
                </div>
              ) : !currentSessionWords || currentWordIndex >= currentSessionWords.length ? (
                <div className="text-center py-20">
                  <div className="sketch-doodle text-6xl mb-4">🎉</div>
                  <h2 className="sketch-font text-2xl font-bold mb-4">
                    准备开始学习吧！
                  </h2>
                  <p className="sketch-font text-muted-foreground mb-6">
                    点击下方按钮开始今天的学习之旅
                  </p>
                  <SketchButton
                    onClick={startLearningSession}
                    size="lg"
                    className="text-lg px-8 py-3"
                  >
                    🚀 开始学习
                  </SketchButton>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="sketch-font text-2xl font-bold mb-2">
                      今日学习
                    </h2>
                    <p className="sketch-font text-muted-foreground">
                      第 {currentWordIndex + 1} / {currentSessionWords.length} 个单词
                    </p>
                  </div>
                  
                  <SketchWordCard
                    word={currentSessionWords[currentWordIndex]}
                    onMarkKnown={(known) => handleWordMark(known ? 'known' : 'unknown')}
                    className="mb-6"
                  />
                </div>
              )}
            </SketchCard>
          </motion.div>
        </div>

        {/* 底部成就展示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <SketchCard className="p-6">
            <h3 className="sketch-font text-xl font-bold mb-4">
              🏆 成就徽章
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { emoji: '🎯', name: '初来乍到', desc: '学习第一个单词' },
                { emoji: '🔥', name: '坚持不懈', desc: '连续学习7天' },
                { emoji: '📚', name: '词汇达人', desc: '掌握50个单词' },
                { emoji: '⭐', name: '完美表现', desc: '测试满分' }
              ].map((achievement, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-muted/30 rounded-lg sketch-border"
                >
                  <div className="text-3xl mb-2">{achievement.emoji}</div>
                  <div className="sketch-font text-sm font-semibold">
                    {achievement.name}
                  </div>
                  <div className="sketch-font text-xs text-muted-foreground">
                    {achievement.desc}
                  </div>
                </div>
              ))}
            </div>
          </SketchCard>
        </motion.div>
      </div>
    </div>
  );
};