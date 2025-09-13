import type { Word, LearningRecord, TestQuestion, TestResult, UserProgress } from '@/types';

// 记忆算法 - 基于艾宾浩斯遗忘曲线
export class MemoryAlgorithm {
  private static readonly INTERVALS = [1, 2, 4, 7, 15, 30]; // 复习间隔（天）
  
  static calculateNextReview(
    difficulty: number,
    consecutiveCorrect: number,
    lastReviewed?: Date
  ): Date {
    const baseInterval = this.INTERVALS[Math.min(consecutiveCorrect, this.INTERVALS.length - 1)];
    const adjustedInterval = baseInterval * Math.max(0.5, difficulty / 3);
    
    const nextReview = new Date(lastReviewed || Date.now());
    nextReview.setDate(nextReview.getDate() + Math.floor(adjustedInterval));
    
    return nextReview;
  }
  
  static shouldReview(
    lastReviewed: Date,
    difficulty: number,
    consecutiveCorrect: number
  ): boolean {
    const nextReview = this.calculateNextReview(difficulty, consecutiveCorrect, lastReviewed);
    return new Date() >= nextReview;
  }
}

// 单词推荐算法
export class WordRecommendation {
  static recommendWords(
    allWords: Word[],
    learningHistory: LearningRecord[],
    count: number = 10
  ): Word[] {
    const wordScores = new Map<string, number>();
    
    // 计算每个单词的优先级分数
    allWords.forEach(word => {
      const history = learningHistory.filter(record => record.wordId === word.id);
      const errorRate = this.calculateErrorRate(history);
      const timeSinceLastReview = this.getTimeSinceLastReview(history);
      const difficultyBonus = word.difficulty * 0.3;
      
      // 综合评分（错误率和时间权重更高）
      const score = errorRate * 0.4 + timeSinceLastReview * 0.3 + difficultyBonus * 0.3;
      wordScores.set(word.id, score);
    });
    
    // 按分数排序并返回前N个
    return allWords
      .sort((a, b) => (wordScores.get(b.id) || 0) - (wordScores.get(a.id) || 0))
      .slice(0, count);
  }
  
  private static calculateErrorRate(history: LearningRecord[]): number {
    if (history.length === 0) return 1;
    
    const incorrectCount = history.filter(record => !record.correct).length;
    return incorrectCount / history.length;
  }
  
  private static getTimeSinceLastReview(history: LearningRecord[]): number {
    if (history.length === 0) return 1;
    
    const lastReview = Math.max(...history.map(record => record.timestamp.getTime()));
    const daysSinceLastReview = (Date.now() - lastReview) / (1000 * 60 * 60 * 24);
    
    return Math.min(daysSinceLastReview / 30, 1); // 归一化到0-1
  }
}

// 测试生成器
export class TestGenerator {
  static generateTest(
    words: Word[],
    questionCount: number = 10,
    types: ('choice' | 'fill-blank' | 'spelling')[] = ['choice']
  ): TestQuestion[] {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, Math.min(questionCount, words.length));
    
    return selectedWords.map((word, index) => {
      const type = types[Math.floor(Math.random() * types.length)];
      
      switch (type) {
        case 'choice':
          return this.generateChoiceQuestion(word, words);
        case 'fill-blank':
          return this.generateFillBlankQuestion(word);
        case 'spelling':
          return this.generateSpellingQuestion(word);
        default:
          return this.generateChoiceQuestion(word, words);
      }
    });
  }
  
  private static generateChoiceQuestion(word: Word, allWords: Word[]): TestQuestion {
    const correctAnswer = word.definitions[0]?.chineseMeaning || '';
    const wrongOptions = allWords
      .filter(w => w.id !== word.id)
      .map(w => w.definitions[0]?.chineseMeaning || '')
      .filter(answer => answer !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const options = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    return {
      id: `choice-${word.id}`,
      wordId: word.id,
      type: 'choice',
      question: `"${word.text}" 的中文意思是？`,
      options,
      correctAnswer,
      explanation: `${word.text} - ${word.phonetic} - ${correctAnswer}`
    };
  }
  
  private static generateFillBlankQuestion(word: Word): TestQuestion {
    const example = word.examples[0]?.sentence || `This is a ${word.text}.`;
    const question = example.replace(new RegExp(word.text, 'gi'), '____');
    
    return {
      id: `fill-${word.id}`,
      wordId: word.id,
      type: 'fill-blank',
      question: `填空：${question}`,
      correctAnswer: word.text,
      explanation: `${word.text} - ${word.definitions[0]?.chineseMeaning || ''}`
    };
  }
  
  private static generateSpellingQuestion(word: Word): TestQuestion {
    return {
      id: `spelling-${word.id}`,
      wordId: word.id,
      type: 'spelling',
      question: `请拼写：${word.definitions[0]?.chineseMeaning || ''}`,
      correctAnswer: word.text.toLowerCase(),
      explanation: `${word.text} - ${word.phonetic}`
    };
  }
}

// 学习统计工具
export class StatsCalculator {
  static calculateAccuracy(testResults: TestResult[]): number {
    if (testResults.length === 0) return 0;
    
    const totalQuestions = testResults.reduce((sum, result) => sum + result.totalQuestions, 0);
    const totalCorrect = testResults.reduce((sum, result) => 
      sum + Math.round((result.score / 100) * result.totalQuestions), 0
    );
    
    return totalCorrect / totalQuestions;
  }
  
  static getWeakWords(
    learningHistory: LearningRecord[],
    threshold: number = 0.5
  ): string[] {
    const wordStats = new Map<string, { correct: number; total: number }>();
    
    learningHistory.forEach(record => {
      const stats = wordStats.get(record.wordId) || { correct: 0, total: 0 };
      stats.total++;
      if (record.correct) stats.correct++;
      wordStats.set(record.wordId, stats);
    });
    
    return Array.from(wordStats.entries())
      .filter(([, stats]) => stats.correct / stats.total < threshold)
      .map(([wordId]) => wordId);
  }
  
  static getStrongWords(
    learningHistory: LearningRecord[],
    threshold: number = 0.8
  ): string[] {
    const wordStats = new Map<string, { correct: number; total: number }>();
    
    learningHistory.forEach(record => {
      const stats = wordStats.get(record.wordId) || { correct: 0, total: 0 };
      stats.total++;
      if (record.correct) stats.correct++;
      wordStats.set(record.wordId, stats);
    });
    
    return Array.from(wordStats.entries())
      .filter(([, stats]) => stats.correct / stats.total >= threshold && stats.total >= 3)
      .map(([wordId]) => wordId);
  }
}

// 数据格式化工具
export class DataFormatter {
  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }
  
  static formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
    return `${Math.floor(diffDays / 365)}年前`;
  }
  
  static getLevelFromExp(exp: number): number {
    // 每级所需经验值递增
    const levelThresholds = [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250];
    
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (exp >= levelThresholds[i]) {
        return i + 1;
      }
    }
    return 1;
  }
  
  static getExpToNextLevel(currentExp: number): number {
    const level = this.getLevelFromExp(currentExp);
    const levelThresholds = [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250];
    
    if (level >= levelThresholds.length) {
      return 0; // 已满级
    }
    
    return levelThresholds[level] - currentExp;
  }
}

// 学习算法工具
export class LearningAlgorithm {
  static getWordsForSession(
    words: Word[],
    userProgress: UserProgress | null,
    mode: 'new' | 'review'
  ): string[] {
    if (mode === 'new') {
      // 新词学习：选择未学习的单词
      const unlearnedWords = words.filter(word => 
        !userProgress?.learnedWords.includes(word.id)
      );
      return unlearnedWords.slice(0, 10).map(word => word.id);
    } else {
      // 复习模式：选择已学习但未掌握的单词
      const reviewWords = words.filter(word => 
        userProgress?.learnedWords.includes(word.id) && 
        !userProgress?.masteredWords.includes(word.id)
      );
      return reviewWords.slice(0, 15).map(word => word.id);
    }
  }
}