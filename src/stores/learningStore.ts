import { create } from 'zustand';

// 简单的UUID生成函数
const generateId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};
import type { 
  Word, 
  UserProgress, 
  LearningRecord, 
  TestResult, 
  UserSettings, 
  LearningStats,
  UserAchievement,
  Achievement
} from '@/types';

interface LearningStore {
  // 用户数据
  userProgress: UserProgress | null;
  userSettings: UserSettings | null;
  learningStats: LearningStats | null;
  achievements: UserAchievement[];
  
  // 学习状态
  words: Word[];
  currentWord: Word | null;
  sessionWords: Word[];
  isLearning: boolean;
  learningHistory: LearningRecord[];
  currentWordIndex: number;
  isFlipped: boolean;
  isKnown: boolean;
  learningMode: 'new' | 'review' | null;
  
  // Actions
  // 用户相关
  initializeUser: () => void;
  updateUserProgress: (progress: Partial<UserProgress>) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  
  // 学习相关
  initializeWords: () => void;
  setCurrentWord: (word: Word | null) => void;
  setSessionWords: (words: Word[]) => void;
  setCurrentWordIndex: (index: number) => void;
  setIsFlipped: (flipped: boolean) => void;
  setIsKnown: (known: boolean) => void;
  setLearningMode: (mode: 'new' | 'review' | null) => void;
  startLearning: () => void;
  stopLearning: () => void;
  addLearningRecord: (record: Omit<LearningRecord, 'id' | 'timestamp'>) => void;
  markWordAsLearned: (wordId: string) => void;
  markWordAsMastered: (wordId: string) => void;
  
  // 测试相关
  startTest: (test: Omit<TestResult, 'id' | 'timestamp'>) => void;
  answerQuestion: (questionIndex: number, answer: string) => void;
  finishTest: () => void;
  
  // 成就相关
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
}

const defaultAchievements: Achievement[] = [
  {
    id: 'first_word',
    name: '初来乍到',
    description: '学习第一个单词',
    icon: '🎯',
    condition: 'learned_words >= 1',
    exp: 10
  },
  {
    id: 'week_streak',
    name: '坚持不懈',
    description: '连续学习7天',
    icon: '🔥',
    condition: 'streak >= 7',
    exp: 50
  },
  {
    id: 'word_master',
    name: '词汇大师',
    description: '掌握100个单词',
    icon: '👑',
    condition: 'mastered_words >= 100',
    exp: 100
  },
  {
    id: 'perfect_score',
    name: '完美表现',
    description: '测试获得满分',
    icon: '⭐',
    condition: 'test_score = 100%',
    exp: 30
  }
];

export const useLearningStore = create<LearningStore>()(
  (set, get) => ({
      // 初始状态
      userProgress: null,
      userSettings: null,
      learningStats: null,
      achievements: [],
      words: [],
      currentWord: null,
      sessionWords: [],
      isLearning: false,
      learningHistory: [],
      currentWordIndex: 0,
      isFlipped: false,
      isKnown: false,
      learningMode: null,
      currentTest: null,
      isTesting: false,

      // Actions
      initializeUser: () => {
        const userId = generateId();
        const now = new Date();
        
        const userProgress: UserProgress = {
          userId,
          totalWords: 0,
          learnedWords: [],
          masteredWords: [],
          currentLevel: 1,
          totalExp: 0,
          streak: 0,
          lastStudyDate: now,
          dailyGoal: 20,
          weeklyGoal: 140,
        };

        const userSettings: UserSettings = {
          userId,
          dailyGoal: 20,
          studyReminders: true,
          reminderTime: '20:00',
          soundEnabled: true,
          theme: 'light',
          difficulty: 'beginner',
          autoPlayAudio: true,
        };

        const learningStats: LearningStats = {
          userId,
          totalWordsLearned: 0,
          averageAccuracy: 0,
          totalStudyTime: 0,
          streak: 0,
          weeklyProgress: 0,
          weakWords: [],
          strongWords: [],
          lastUpdated: now,
        };

        set({
          userProgress,
          userSettings,
          learningStats,
        });
      },

      updateUserProgress: (progress) => set((state) => ({
        userProgress: state.userProgress 
          ? { ...state.userProgress, ...progress } 
          : null
      })),

      updateUserSettings: (settings) => set((state) => ({
        userSettings: state.userSettings 
          ? { ...state.userSettings, ...settings } 
          : null
      })),

      initializeWords: () => {
        // Import sample words
        import('@/data/words').then(({ sampleWords }) => {
          set({ words: sampleWords });
        });
      },

      setCurrentWord: (word) => set({ currentWord: word }),

      setSessionWords: (words) => set({ sessionWords: words }),

      setCurrentWordIndex: (index) => set({ currentWordIndex: index }),

      setIsFlipped: (flipped) => set({ isFlipped: flipped }),

      setIsKnown: (known) => set({ isKnown: known }),

      setLearningMode: (mode) => set({ learningMode: mode }),

      startLearning: () => set({ isLearning: true }),

      stopLearning: () => set({ isLearning: false, currentWord: null }),

      addLearningRecord: (record) => {
        const newRecord: LearningRecord = {
          ...record,
          id: generateId(),
          timestamp: new Date(),
        };

        set((state) => ({
          learningHistory: [...state.learningHistory, newRecord],
          learningStats: state.learningStats ? {
            ...state.learningStats,
            totalStudyTime: state.learningStats.totalStudyTime + record.timeSpent,
            lastUpdated: new Date(),
          } : null,
        }));
      },

      markWordAsLearned: (wordId) => set((state) => {
        if (!state.userProgress) return state;

        const learnedWords = state.userProgress.learnedWords.includes(wordId)
          ? state.userProgress.learnedWords
          : [...state.userProgress.learnedWords, wordId];

        return {
          userProgress: {
            ...state.userProgress,
            learnedWords,
            totalWords: learnedWords.length,
            totalExp: state.userProgress.totalExp + 5,
          },
          learningStats: state.learningStats ? {
            ...state.learningStats,
            totalWordsLearned: learnedWords.length,
            lastUpdated: new Date(),
          } : null,
        };
      }),

      markWordAsMastered: (wordId) => set((state) => {
        if (!state.userProgress) return state;

        const masteredWords = state.userProgress.masteredWords.includes(wordId)
          ? state.userProgress.masteredWords
          : [...state.userProgress.masteredWords, wordId];

        return {
          userProgress: {
            ...state.userProgress,
            masteredWords,
            totalExp: state.userProgress.totalExp + 10,
          },
        };
      }),

      startTest: (test) => {
        const newTest: TestResult = {
          ...test,
          id: generateId(),
          timestamp: new Date(),
        };
        set({ currentTest: newTest, isTesting: true });
      },

      answerQuestion: (questionIndex, answer) => set((state) => {
        if (!state.currentTest) return state;

        const newAnswers = [...state.currentTest.answers];
        newAnswers[questionIndex] = answer;

        return {
          currentTest: {
            ...state.currentTest,
            answers: newAnswers,
          },
        };
      }),

      finishTest: () => {
        const state = get();
        if (!state.currentTest) return;

        // 计算分数
        let correctCount = 0;
        state.currentTest.questions.forEach((question, index) => {
          if (state.currentTest?.answers[index] === question.correctAnswer) {
            correctCount++;
          }
        });

        const score = Math.round((correctCount / state.currentTest.totalQuestions) * 100);

        const finishedTest: TestResult = {
          ...state.currentTest,
          score,
        };

        set({
          currentTest: finishedTest,
          isTesting: false,
        });
      },

      unlockAchievement: (achievementId) => set((state) => {
        const existing = state.achievements.find(a => a.achievementId === achievementId);
        if (existing) return state;

        const newAchievement: UserAchievement = {
          userId: state.userProgress?.userId || '',
          achievementId,
          unlockedAt: new Date(),
          progress: 100,
        };

        return {
          achievements: [...state.achievements, newAchievement],
        };
      }),

      updateAchievementProgress: (achievementId, progress) => set((state) => {
        return {
          achievements: state.achievements.map(achievement =>
            achievement.achievementId === achievementId
              ? { ...achievement, progress: Math.min(progress, 100) }
              : achievement
          ),
        };
      }),
    })
);