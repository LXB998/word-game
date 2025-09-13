import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLearningStore } from '@/stores/learningStore';
import { SketchWordCard } from '@/components/sketch/SketchWordCard';
import { SketchCard, SketchProgress, SketchButton } from '@/components/sketch/SketchComponents';
import { LearningAlgorithm } from '@/lib/learning';
import { cn } from '@/lib/utils';

export const LearnPage: React.FC = () => {
  const {
    words,
    userProgress,
    currentWordIndex,
    isFlipped,
    isKnown,
    learningMode,
    setCurrentWordIndex,
    setIsFlipped,
    setIsKnown,
    setLearningMode,
    addLearningRecord,
    initializeWords
  } = useLearningStore();

  const [sessionWords, setSessionWords] = useState<string[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    known: 0,
    unknown: 0,
    timeSpent: 0
  });

  // 初始化学习词汇
  useEffect(() => {
    if (words.length === 0) {
      initializeWords();
    }
  }, [words.length, initializeWords]);

  // 开始新的学习会话
  const startLearningSession = (mode: 'new' | 'review') => {
    const wordsToLearn = LearningAlgorithm.getWordsForSession(words, userProgress, mode);
    setSessionWords(wordsToLearn);
    setCurrentWordIndex(0);
    setSessionStartTime(Date.now());
    setSessionStats({
      total: wordsToLearn.length,
      known: 0,
      unknown: 0,
      timeSpent: 0
    });
    setLearningMode(mode);
  };

  // 处理单词学习结果
  const handleWordResult = (known: boolean) => {
    if (sessionWords.length === 0 || currentWordIndex >= sessionWords.length) return;

    const currentWordId = sessionWords[currentWordIndex];
    const word = words.find(w => w.id === currentWordId);
    if (!word) return;

    // 更新统计
    setSessionStats(prev => ({
      ...prev,
      known: known ? prev.known + 1 : prev.known,
      unknown: !known ? prev.unknown + 1 : prev.unknown
    }));

    // 记录学习
    addLearningRecord({
      wordId: currentWordId,
      userId: userProgress?.userId || '',
      action: known ? 'learned' : 'reviewed',
      correct: known,
      timeSpent: Math.round((Date.now() - sessionStartTime) / 1000),
      difficulty: word.difficulty
    });

    // 移动到下一个单词
    if (currentWordIndex < sessionWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setSessionStartTime(Date.now());
    } else {
      // 学习会话结束
      setCurrentWordIndex(-1);
    }
  };

  const getCurrentWord = () => {
    if (sessionWords.length === 0 || currentWordIndex >= sessionWords.length) return null;
    const wordId = sessionWords[currentWordIndex];
    return words.find(w => w.id === wordId) || null;
  };

  const currentWord = getCurrentWord();
  const progress = sessionWords.length > 0 ? ((currentWordIndex + 1) / sessionWords.length) * 100 : 0;

  if (sessionWords.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/30 to-purple-50/30">
        {/* 背景装饰 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl opacity-10 sketch-doodle">📚</div>
          <div className="absolute top-20 right-20 text-4xl opacity-10 sketch-doodle">🎯</div>
          <div className="absolute bottom-20 left-20 text-5xl opacity-10 sketch-doodle">✏️</div>
          <div className="absolute bottom-10 right-10 text-3xl opacity-10 sketch-doodle">📖</div>
        </div>

        <div className="relative container mx-auto px-4 py-8">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="sketch-font text-4xl font-bold text-foreground mb-4">
              📚 单词学习
            </h1>
            <p className="sketch-font text-lg text-muted-foreground">
              选择学习模式开始你的单词之旅
            </p>
          </motion.header>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 新词学习 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SketchCard className="p-8 text-center h-full">
                <div className="sketch-doodle text-6xl mb-4">🆕</div>
                <h3 className="sketch-font text-2xl font-bold mb-4">
                  学习新单词
                </h3>
                <p className="sketch-font text-muted-foreground mb-6">
                  学习全新的单词，扩展你的词汇量
                </p>
                <SketchButton
                  onClick={() => startLearningSession('new')}
                  size="lg"
                  className="w-full"
                >
                  🚀 开始学习新词
                </SketchButton>
              </SketchCard>
            </motion.div>

            {/* 复习模式 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SketchCard className="p-8 text-center h-full">
                <div className="sketch-doodle text-6xl mb-4">🔄</div>
                <h3 className="sketch-font text-2xl font-bold mb-4">
                  复习巩固
                </h3>
                <p className="sketch-font text-muted-foreground mb-6">
                  根据遗忘曲线智能复习已学单词
                </p>
                <SketchButton
                  onClick={() => startLearningSession('review')}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  📝 开始复习
                </SketchButton>
              </SketchCard>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // 学习会话进行中
  if (currentWordIndex >= 0 && currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/30 to-purple-50/30">
        <div className="container mx-auto px-4 py-8">
          {/* 进度条 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <SketchProgress
              value={progress}
              label="学习进度"
              variant="pencil"
            />
            <div className="text-center mt-2 sketch-font text-sm text-muted-foreground">
              {currentWordIndex + 1} / {sessionWords.length}
            </div>
          </motion.div>

          {/* 单词卡片 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto mb-8"
          >
            <SketchWordCard
              word={currentWord}
              isFlipped={isFlipped}
              isKnown={isKnown}
              onFlip={() => setIsFlipped(!isFlipped)}
              onMarkKnown={(known) => {
                setIsKnown(known);
                setTimeout(() => handleWordResult(known), 500);
              }}
            />
          </motion.div>

          {/* 会话统计 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <SketchCard className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="sketch-font text-lg font-bold text-primary">
                    {sessionStats.total}
                  </div>
                  <div className="sketch-font text-xs text-muted-foreground">总单词</div>
                </div>
                <div>
                  <div className="sketch-font text-lg font-bold text-green-600">
                    {sessionStats.known}
                  </div>
                  <div className="sketch-font text-xs text-muted-foreground">已认识</div>
                </div>
                <div>
                  <div className="sketch-font text-lg font-bold text-red-600">
                    {sessionStats.unknown}
                  </div>
                  <div className="sketch-font text-xs text-muted-foreground">需复习</div>
                </div>
              </div>
            </SketchCard>
          </motion.div>
        </div>
      </div>
    );
  }

  // 学习会话结束
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/30 to-purple-50/30">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <SketchCard className="p-12">
            <div className="sketch-doodle text-6xl mb-6">🎉</div>
            <h2 className="sketch-font text-3xl font-bold mb-4">
              学习完成！
            </h2>
            <div className="space-y-4 mb-8">
              <div className="sketch-font text-lg">
                总共学习了 <span className="font-bold text-primary">{sessionStats.total}</span> 个单词
              </div>
              <div className="sketch-font text-green-600">
                认识了 {sessionStats.known} 个单词
              </div>
              <div className="sketch-font text-red-600">
                需要加强 {sessionStats.unknown} 个单词
              </div>
            </div>
            <div className="space-y-3">
              <SketchButton
                onClick={() => startLearningSession('new')}
                size="lg"
                className="w-full"
              >
                🚀 继续学习新词
              </SketchButton>
              <SketchButton
                onClick={() => startLearningSession('review')}
                variant="outline"
                size="lg"
                className="w-full"
              >
                📝 开始复习
              </SketchButton>
            </div>
          </SketchCard>
        </motion.div>
      </div>
    </div>
  );
};