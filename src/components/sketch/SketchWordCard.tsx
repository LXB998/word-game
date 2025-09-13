import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Word } from '@/types';
import { SketchCard } from './SketchComponents';
import { cn } from '@/lib/utils';

interface SketchWordCardProps {
  word: Word;
  isFlipped?: boolean;
  isKnown?: boolean;
  onFlip?: () => void;
  onMarkKnown?: (known: boolean) => void;
  showActions?: boolean;
  className?: string;
}

export const SketchWordCard: React.FC<SketchWordCardProps> = ({
  word,
  isFlipped: externalIsFlipped,
  isKnown,
  onFlip,
  onMarkKnown,
  showActions = true,
  className
}) => {
  const [internalIsFlipped, setIsFlipped] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);
  
  const isFlipped = externalIsFlipped !== undefined ? externalIsFlipped : internalIsFlipped;

  const handleCardClick = () => {
    if (externalIsFlipped === undefined) {
      setIsFlipped(!internalIsFlipped);
    }
    onFlip?.();
  };

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-600';
      case 2: return 'text-blue-600';
      case 3: return 'text-yellow-600';
      case 4: return 'text-orange-600';
      case 5: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return '简单';
      case 2: return '容易';
      case 3: return '中等';
      case 4: return '困难';
      case 5: return '很难';
      default: return '未知';
    }
  };

  return (
    <div className={cn('relative w-full max-w-md mx-auto', className)}>
      {/* 3D翻转卡片 */}
      <div
        className="relative w-full h-80 cursor-pointer perspective-1000"
        onClick={handleCardClick}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isFlipped ? 'back' : 'front'}
            className="absolute w-full h-full backface-hidden"
            initial={{ rotateY: isFlipped ? 180 : 0 }}
            animate={{ rotateY: isFlipped ? 0 : 180 }}
            exit={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 300 }}
          >
            <SketchCard className="h-full flex flex-col justify-center items-center text-center p-8">
              {/* 正面 - 单词 */}
              <div className="space-y-4">
                {/* 难度标识 */}
                <div className={cn(
                  'absolute top-4 right-4 sketch-font text-xs px-2 py-1 rounded-full',
                  'bg-muted/50',
                  getDifficultyColor(word.difficulty)
                )}>
                  {getDifficultyLabel(word.difficulty)}
                </div>

                {/* 装饰元素 */}
                <div className="absolute top-4 left-4 sketch-doodle text-2xl opacity-30">
                  📝
                </div>

                {/* 单词 */}
                <h2 className="sketch-font text-4xl font-bold text-foreground mb-2">
                  {word.text}
                </h2>

                {/* 音标 */}
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPhonetic(!showPhonetic);
                    handlePlayAudio();
                  }}
                >
                  <span className="text-lg">🔊</span>
                  {showPhonetic && (
                    <span className="sketch-font text-muted-foreground">
                      {word.phonetic}
                    </span>
                  )}
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1 justify-center mt-4">
                  {word.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="sketch-font text-xs px-2 py-1 bg-primary/10 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 提示文字 */}
                <p className="sketch-font text-sm text-muted-foreground mt-6">
                  点击卡片查看释义
                </p>
              </div>
            </SketchCard>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 背面 - 释义 */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isFlipped ? 'front' : 'back'}
          className="absolute w-full h-full backface-hidden"
          initial={{ rotateY: -180 }}
          animate={{ rotateY: isFlipped ? -180 : 0 }}
          exit={{ rotateY: -180 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 300 }}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <SketchCard className="h-full flex flex-col p-6">
            <div className="flex-1 space-y-4">
              {/* 单词标题 */}
              <div className="text-center border-b border-foreground/20 pb-2">
                <h3 className="sketch-font text-2xl font-bold">
                  {word.text}
                </h3>
                <p className="sketch-font text-muted-foreground">
                  {word.phonetic}
                </p>
              </div>

              {/* 释义 */}
              <div className="space-y-3">
                <h4 className="sketch-font text-lg font-semibold">
                  释义：
                </h4>
                {word.definitions.map((def, index) => (
                  <div key={index} className="space-y-1">
                    <span className="sketch-font text-sm text-primary">
                      {def.partOfSpeech}
                    </span>
                    <p className="sketch-font text-foreground">
                      {def.chineseMeaning}
                    </p>
                    <p className="sketch-font text-sm text-muted-foreground">
                      {def.meaning}
                    </p>
                  </div>
                ))}
              </div>

              {/* 例句 */}
              {word.examples.length > 0 && (
                <div className="space-y-2">
                  <h4 className="sketch-font text-lg font-semibold">
                    例句：
                  </h4>
                  {word.examples.map((example, index) => (
                    <div key={index} className="space-y-1">
                      <p className="sketch-font text-sm italic">
                        "{example.sentence}"
                      </p>
                      <p className="sketch-font text-sm text-muted-foreground">
                        {example.translation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 提示文字 */}
            <p className="sketch-font text-sm text-muted-foreground text-center mt-4">
              点击卡片返回
            </p>
          </SketchCard>
        </motion.div>
      </AnimatePresence>

      {/* 操作按钮 */}
      {showActions && (
        <div className="flex gap-3 mt-6 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="sketch-button px-4 py-2 bg-red-100 text-red-700 sketch-border handwritten-shadow"
            onClick={() => onMarkKnown?.(false)}
          >
            <span className="sketch-font">不认识</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="sketch-button px-4 py-2 bg-green-100 text-green-700 sketch-border handwritten-shadow"
            onClick={() => onMarkKnown?.(true)}
          >
            <span className="sketch-font">已掌握</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};