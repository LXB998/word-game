import React from 'react';
import { motion } from 'framer-motion';
import { SketchButton } from './SketchComponents';
import { cn } from '@/lib/utils';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onPageChange
}) => {
  const navItems = [
    { id: 'home', label: '🏠 首页', icon: '🏠' },
    { id: 'learn', label: '📚 学习', icon: '📚' },
    { id: 'test', label: '🎯 测试', icon: '🎯' },
    { id: 'stats', label: '📊 统计', icon: '📊' }
  ];

  return (
    <nav className="sticky top-4 z-50 mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sketch-card p-2 bg-white/90 backdrop-blur-sm"
      >
        <div className="flex flex-wrap justify-center gap-2">
          {navItems.map((item) => (
            <motion.div key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <SketchButton
                variant={currentPage === item.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onPageChange(item.id)}
              >
                <span className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </SketchButton>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};