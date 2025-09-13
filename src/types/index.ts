// 词汇相关类型
export interface Word {
  id: string;
  text: string;
  phonetic: string;
  definitions: Definition[];
  examples: Example[];
  difficulty: number; // 1-5
  frequency: number; // 使用频率
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Definition {
  partOfSpeech: string;
  meaning: string;
  chineseMeaning: string;
}

export interface Example {
  sentence: string;
  translation: string;
}

// 学习记录类型
export interface LearningRecord {
  id: string;
  wordId: string;
  userId: string;
  action: 'learned' | 'reviewed' | 'tested' | 'mastered';
  correct: boolean;
  timeSpent: number; // 秒
  difficulty: number; // 用户感受的难度 1-5
  timestamp: Date;
}

// 用户进度类型
export interface UserProgress {
  userId: string;
  totalWords: number;
  learnedWords: string[];
  masteredWords: string[];
  currentLevel: number;
  totalExp: number;
  streak: number; // 连续学习天数
  lastStudyDate: Date;
  dailyGoal: number;
  weeklyGoal: number;
}

// 测试相关类型
export interface TestQuestion {
  id: string;
  wordId: string;
  type: 'choice' | 'fill-blank' | 'spelling' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface TestResult {
  id: string;
  userId: string;
  testType: string;
  questions: TestQuestion[];
  answers: string[];
  score: number;
  totalQuestions: number;
  timeSpent: number;
  timestamp: Date;
}

// 成就系统类型
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  exp: number;
  unlockedAt?: Date;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number; // 0-100
}

// 用户设置类型
export interface UserSettings {
  userId: string;
  dailyGoal: number;
  studyReminders: boolean;
  reminderTime: string;
  soundEnabled: boolean;
  theme: 'light' | 'dark';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  autoPlayAudio: boolean;
}

// 学习统计类型
export interface LearningStats {
  userId: string;
  totalWordsLearned: number;
  averageAccuracy: number;
  totalStudyTime: number;
  streak: number;
  weeklyProgress: number;
  weakWords: string[];
  strongWords: string[];
  lastUpdated: Date;
}

// 应用状态类型
export interface AppState {
  user: {
    id: string;
    progress: UserProgress;
    settings: UserSettings;
    stats: LearningStats;
    achievements: UserAchievement[];
  };
  learning: {
    currentWord: Word | null;
    sessionWords: Word[];
    sessionProgress: number;
    isLearning: boolean;
  };
  test: {
    currentTest: TestQuestion[] | null;
    currentQuestionIndex: number;
    answers: string[];
    isTesting: boolean;
    timeSpent: number;
  };
}