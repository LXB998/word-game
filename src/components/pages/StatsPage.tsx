import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLearningStore } from '@/stores/learningStore';
import { DataFormatter, StatsCalculator } from '@/lib/learning';
import { SketchCard, SketchProgress } from '@/components/sketch/SketchComponents';
import { TestComponent } from '@/components/test/TestComponent';
import { SketchButton } from '@/components/sketch/SketchComponents';

export const StatsPage: React.FC = () => {
  const {
    userProgress,
    userSettings,
    learningStats,
    learningHistory,
    achievements
  } = useLearningStore();

  // 计算统计数据
  const stats = useMemo(() => {
    if (!learningStats || !userProgress) return null;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const thisWeekRecords = learningHistory.filter(
      record => new Date(record.timestamp) >= weekAgo
    );

    const weeklyStudyTime = thisWeekRecords.reduce(
      (sum, record) => sum + record.timeSpent, 0
    );

    const weeklyProgress = (thisWeekRecords.length / userSettings?.dailyGoal! / 7) * 100;

    return {
      ...learningStats,
      weeklyStudyTime,
      weeklyProgress: Math.min(weeklyProgress, 100)
    };
  }, [learningStats, learningHistory, userProgress, userSettings]);

  const weakWords = useMemo(() => {
    return StatsCalculator.getWeakWords(learningHistory, 0.6);
  }, [learningHistory]);

  const strongWords = useMemo(() => {
    return StatsCalculator.getStrongWords(learningHistory, 0.8);
  }, [learningHistory]);

  const getLevelProgress = () => {
    if (!userProgress) return { current: 1, progress: 0 };
    
    const level = DataFormatter.getLevelFromExp(userProgress.totalExp);
    const expToNext = DataFormatter.getExpToNextLevel(userProgress.totalExp);
    const expForCurrentLevel = level === 1 ? 0 : 
      [0, 50, 150, 300, 500, 750, 1050, 1400, 1800][level - 1];
    
    const progress = level >= 9 ? 100 : 
      ((userProgress.totalExp - expForCurrentLevel) / (expToNext + expForCurrentLevel - expForCurrentLevel)) * 100;
    
    return { current: level, progress };
  };

  const getStudyStreak = () => {
    if (!userProgress) return 0;
    return userProgress.streak;
  };

  if (!userProgress || !stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SketchCard className="max-w-2xl mx-auto p-8 text-center">
          <div className="sketch-doodle text-6xl mb-4">⏳</div>
          <h2 className="sketch-font text-2xl font-bold mb-4">
            正在加载统计数据...
          </h2>
        </SketchCard>
      </div>
    );
  }

  const levelInfo = getLevelProgress();
  const streak = getStudyStreak();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-blue-50/30 to-purple-50/30">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-10 sketch-doodle">📊</div>
        <div className="absolute top-20 right-20 text-4xl opacity-10 sketch-doodle">📈</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 sketch-doodle">🏆</div>
        <div className="absolute bottom-10 right-10 text-3xl opacity-10 sketch-doodle">⭐</div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* 头部 */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="sketch-font text-4xl font-bold text-foreground mb-2">
            学习统计
          </h1>
          <p className="sketch-font text-lg text-muted-foreground">
            查看你的学习进度和成就
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧 - 基础统计 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* 等级和经验 */}
            <SketchCard className="p-6">
              <h3 className="sketch-font text-xl font-bold mb-4">
                🎖️ 等级进度
              </h3>
              <div className="text-center mb-4">
                <div className="sketch-font text-3xl font-bold text-primary">
                  Lv.{levelInfo.current}
                </div>
                <div className="sketch-font text-sm text-muted-foreground">
                  经验值: {userProgress.totalExp}
                </div>
              </div>
              <SketchProgress
                value={levelInfo.progress}
                label="升级进度"
                variant="watercolor"
              />
            </SketchCard>

            {/* 学习统计 */}
            <SketchCard className="p-6">
              <h3 className="sketch-font text-xl font-bold mb-4">
                📚 学习统计
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="sketch-font">总词汇量</span>
                  <span className="sketch-font text-lg font-semibold">
                    {userProgress.totalWords}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="sketch-font">已掌握</span>
                  <span className="sketch-font text-lg font-semibold text-green-600">
                    {userProgress.masteredWords.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="sketch-font">学习时长</span>
                  <span className="sketch-font text-lg font-semibold">
                    {DataFormatter.formatTime(stats.totalStudyTime)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="sketch-font">正确率</span>
                  <span className="sketch-font text-lg font-semibold text-blue-600">
                    {Math.round(stats.averageAccuracy * 100)}%
                  </span>
                </div>
              </div>
            </SketchCard>

            {/* 连续学习 */}
            <SketchCard className="p-6">
              <h3 className="sketch-font text-xl font-bold mb-4 flex items-center gap-2">
                🔥 连续学习
              </h3>
              <div className="text-center">
                <div className="sketch-font text-4xl font-bold text-orange-600 mb-2">
                  {streak}
                </div>
                <div className="sketch-font text-muted-foreground">
                  天
                </div>
                {streak >= 7 && (
                  <div className="mt-2 text-sm text-orange-600 sketch-font">
                    🏆 坚持不懈！
                  </div>
                )}
              </div>
            </SketchCard>
          </motion.div>

          {/* 中间 - 周进度和测试 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* 本周进度 */}
            <SketchCard className="p-6">
              <h3 className="sketch-font text-xl font-bold mb-4">
                📅 本周进度
              </h3>
              <div className="space-y-4">
                <SketchProgress
                  value={stats.weeklyProgress}
                  label="周目标完成度"
                  variant="pencil"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="sketch-font text-xl font-bold text-primary">
                      {Math.round(stats.weeklyStudyTime / 60)}
                    </div>
                    <div className="sketch-font text-sm text-muted-foreground">
                      学习时长(分钟)
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="sketch-font text-xl font-bold text-green-600">
                      {learningHistory.filter(r => {
                        const date = new Date(r.timestamp);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return date >= weekAgo;
                      }).length}
                    </div>
                    <div className="sketch-font text-sm text-muted-foreground">
                      学习次数
                    </div>
                  </div>
                </div>
              </div>
            </SketchCard>

            {/* 快速测试 */}
            <SketchCard className="p-6">
              <h3 className="sketch-font text-xl font-bold mb-4">
                🎯 快速测试
              </h3>
              <TestComponent
                questionCount={5}
                testType="choice"
                onComplete={(result) => {
                  // 可以在这里处理测试结果
                  console.log('Test completed:', result);
                }}
              />
            </SketchCard>
          </motion.div>

          {/* 右侧 - 成就和词汇分析 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* 成就展示 */}
            <SketchCard className="p-6">
              <h3 className="sketch-font text-xl font-bold mb-4">
                🏆 已获成就
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {achievements.slice(0, 4).map((achievement, index) => (
                  <div
                    key={index}
                    className="text-center p-3 bg-green-50/80 rounded-lg sketch-border"
                  >
                    <div className="text-2xl mb-1">🎖️</div>
                    <div className="sketch-font text-xs font-semibold">
                      成就解锁
                    </div>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <div className="col-span-2 text-center py-4">
                    <div className="sketch-doodle text-3xl mb-2">🔒</div>
                    <p className="sketch-font text-sm text-muted-foreground">
                      继续学习解锁成就
                    </p>
                  </div>
                )}
              </div>
            </SketchCard>

            {/* 词汇分析 */}
            <SketchCard className="p-6">
              <h3 className="sketch-font text-xl font-bold mb-4">
                📊 词汇分析
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="sketch-font text-sm font-semibold text-green-600 mb-2">
                    💪 强项词汇 ({strongWords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {strongWords.slice(0, 6).map((wordId, index) => (
                      <span
                        key={index}
                        className="sketch-font text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full"
                      >
                        {wordId.slice(0, 6)}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="sketch-font text-sm font-semibold text-red-600 mb-2">
                    🔶 待加强词汇 ({weakWords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {weakWords.slice(0, 6).map((wordId, index) => (
                      <span
                        key={index}
                        className="sketch-font text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full"
                      >
                        {wordId.slice(0, 6)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </SketchCard>

            {/* 操作按钮 */}
            <SketchCard className="p-6">
              <h3 className="sketch-font text-xl font-bold mb-4">
                ⚙️ 学习设置
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="sketch-font">每日目标</span>
                  <span className="sketch-font text-primary font-semibold">
                    {userSettings?.dailyGoal} 词
                  </span>
                </div>
                <button className="sketch-button w-full sketch-font" disabled>
                  📝 修改目标
                </button>
                <button className="sketch-button w-full sketch-font" disabled>
                  💾 备份数据
                </button>
              </div>
            </SketchCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};