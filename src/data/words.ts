import type { Word } from '@/types';

export const sampleWords: Word[] = [
  {
    id: '1',
    text: 'abandon',
    phonetic: '/əˈbændən/',
    definitions: [
      {
        partOfSpeech: 'v.',
        meaning: 'to leave sb/sth, especially when you are responsible for them',
        chineseMeaning: '抛弃；放弃'
      }
    ],
    examples: [
      {
        sentence: 'The captain gave orders to abandon the ship.',
        translation: '船长下令弃船。'
      }
    ],
    difficulty: 2,
    frequency: 4,
    tags: ['common', 'verb'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    text: 'ability',
    phonetic: '/əˈbɪləti/',
    definitions: [
      {
        partOfSpeech: 'n.',
        meaning: 'the physical or mental power or skill needed to do something',
        chineseMeaning: '能力；才能'
      }
    ],
    examples: [
      {
        sentence: 'She has the ability to make people feel at ease.',
        translation: '她有能力让人们感到放松。'
      }
    ],
    difficulty: 1,
    frequency: 5,
    tags: ['common', 'noun'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    text: 'academic',
    phonetic: '/ˌækəˈdemɪk/',
    definitions: [
      {
        partOfSpeech: 'adj.',
        meaning: 'relating to education, especially at college or university level',
        chineseMeaning: '学术的；学院的'
      }
    ],
    examples: [
      {
        sentence: 'The university is known for its high academic standards.',
        translation: '这所大学以其高学术水平而闻名。'
      }
    ],
    difficulty: 3,
    frequency: 3,
    tags: ['education', 'adjective'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    text: 'accept',
    phonetic: '/əkˈsept/',
    definitions: [
      {
        partOfSpeech: 'v.',
        meaning: 'to take or receive something that is offered',
        chineseMeaning: '接受；认可'
      }
    ],
    examples: [
      {
        sentence: 'She accepted the job offer immediately.',
        translation: '她立即接受了工作邀请。'
      }
    ],
    difficulty: 1,
    frequency: 5,
    tags: ['common', 'verb'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    text: 'achieve',
    phonetic: '/əˈtʃiːv/',
    definitions: [
      {
        partOfSpeech: 'v.',
        meaning: 'to succeed in reaching a particular goal or standard',
        chineseMeaning: '实现；达到；获得'
      }
    ],
    examples: [
      {
        sentence: 'She worked hard to achieve her goals.',
        translation: '她努力工作以实现她的目标。'
      }
    ],
    difficulty: 2,
    frequency: 4,
    tags: ['common', 'verb'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '6',
    text: 'across',
    phonetic: '/əˈkrɒs/',
    definitions: [
      {
        partOfSpeech: 'prep.',
        meaning: 'from one side to the other side of something',
        chineseMeaning: '横过；穿过'
      }
    ],
    examples: [
      {
        sentence: 'He walked across the street.',
        translation: '他走过街道。'
      }
    ],
    difficulty: 1,
    frequency: 5,
    tags: ['common', 'preposition'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '7',
    text: 'activity',
    phonetic: '/ækˈtɪvəti/',
    definitions: [
      {
        partOfSpeech: 'n.',
        meaning: 'something that you do because you enjoy it or because it is useful',
        chineseMeaning: '活动；行动'
      }
    ],
    examples: [
      {
        sentence: 'The school offers many after-school activities.',
        translation: '学校提供许多课外活动。'
      }
    ],
    difficulty: 1,
    frequency: 4,
    tags: ['common', 'noun'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '8',
    text: 'actually',
    phonetic: '/ˈækʧuəli/',
    definitions: [
      {
        partOfSpeech: 'adv.',
        meaning: 'in fact or really',
        chineseMeaning: '实际上；事实上'
      }
    ],
    examples: [
      {
        sentence: 'Actually, I prefer tea to coffee.',
        translation: '实际上，比起咖啡我更喜欢茶。'
      }
    ],
    difficulty: 1,
    frequency: 4,
    tags: ['common', 'adverb'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '9',
    text: 'address',
    phonetic: '/əˈdres/',
    definitions: [
      {
        partOfSpeech: 'n.',
        meaning: 'the number of the building and the name of the street and town where a person lives or works',
        chineseMeaning: '地址；住址'
      },
      {
        partOfSpeech: 'v.',
        meaning: 'to write on an envelope, package etc. the name and address of the person you are sending it to',
        chineseMeaning: '写地址；演讲'
      }
    ],
    examples: [
      {
        sentence: 'What is your home address?',
        translation: '你的家庭住址是什么？'
      },
      {
        sentence: 'The president will address the nation tonight.',
        translation: '总统今晚将向全国发表讲话。'
      }
    ],
    difficulty: 2,
    frequency: 4,
    tags: ['common', 'noun', 'verb'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '10',
    text: 'administration',
    phonetic: '/ədˌmɪnɪˈstreɪʃn/',
    definitions: [
      {
        partOfSpeech: 'n.',
        meaning: 'the activities that are involved in managing the work of a company or organization',
        chineseMeaning: '管理；行政'
      }
    ],
    examples: [
      {
        sentence: 'She works in hospital administration.',
        translation: '她在医院行政部门工作。'
      }
    ],
    difficulty: 3,
    frequency: 3,
    tags: ['education', 'noun'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// 按难度分类的词汇
export const wordsByDifficulty = {
  easy: sampleWords.filter(word => word.difficulty <= 2),
  medium: sampleWords.filter(word => word.difficulty === 3),
  hard: sampleWords.filter(word => word.difficulty >= 4)
};

// 按词性分类的词汇
export const wordsByPartOfSpeech = {
  noun: sampleWords.filter(word => word.definitions.some(def => def.partOfSpeech === 'n.')),
  verb: sampleWords.filter(word => word.definitions.some(def => def.partOfSpeech === 'v.')),
  adjective: sampleWords.filter(word => word.definitions.some(def => def.partOfSpeech === 'adj.')),
  adverb: sampleWords.filter(word => word.definitions.some(def => def.partOfSpeech === 'adv.')),
  preposition: sampleWords.filter(word => word.definitions.some(def => def.partOfSpeech === 'prep.'))
};

// 获取随机单词
export const getRandomWords = (count: number, difficulty?: number): Word[] => {
  let pool = sampleWords;
  if (difficulty) {
    pool = sampleWords.filter(word => word.difficulty === difficulty);
  }
  
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 按标签获取单词
export const getWordsByTag = (tag: string): Word[] => {
  return sampleWords.filter(word => word.tags.includes(tag));
};