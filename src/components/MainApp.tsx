import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { TestPage } from './pages/TestPage';
import { StatsPage } from './pages/StatsPage';

export const MainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'learn':
        return <LearnPage />;
      case 'test':
        return <TestPage />;
      case 'stats':
        return <StatsPage />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/20 via-blue-50/20 to-green-50/20">
      {/* 导航栏 */}
      <nav className="sticky top-4 z-50 mx-auto max-w-4xl py-4">
        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md sketch-border">
          <div className="flex justify-center gap-2">
            {['home', 'learn', 'test', 'stats'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 sketch-font ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground sketch-button-active'
                    : 'bg-muted hover:bg-muted/80 sketch-button'
                }`}
              >
                {page === 'home' && '🏠 首页'}
                {page === 'learn' && '📚 学习'}
                {page === 'test' && '🎯 测试'}
                {page === 'stats' && '📊 统计'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 页面内容 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};