import React from 'react';
import { cn } from '@/lib/utils';

interface SketchButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const SketchButton: React.FC<SketchButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled,
}) => {
  const baseClasses = 'sketch-button relative overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'bg-transparent border-2 border-primary text-primary'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        'sketch-border handwritten-shadow',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full hover:translate-x-full transition-transform duration-1000" />
    </button>
  );
};

interface SketchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'paper' | 'notebook';
}

export const SketchCard: React.FC<SketchCardProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-card text-card-foreground',
    paper: 'bg-amber-50/80',
    notebook: 'bg-blue-50/80'
  };

  return (
    <div
      className={cn(
        'sketch-card relative overflow-hidden',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {/* 纸张纹理效果 */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-transparent via-gray-200/20 to-transparent pointer-events-none" />
      
      {/* 装饰元素 */}
      <div className="absolute top-2 right-2 sketch-doodle opacity-30">
        ✏️
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface SketchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const SketchInput: React.FC<SketchInputProps> = ({
  className,
  label,
  error,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="sketch-font text-sm font-medium text-foreground/80">
          {label}
        </label>
      )}
      <input
        className={cn(
          'sketch-input w-full px-3 py-2 bg-transparent border-b-2 border-foreground/30 outline-none transition-colors focus:border-primary sketch-font',
          error && 'border-destructive',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-destructive sketch-font">{error}</p>
      )}
    </div>
  );
};

interface SketchProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'pencil' | 'watercolor';
}

export const SketchProgress: React.FC<SketchProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  variant = 'default'
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const variantClasses = {
    default: 'bg-primary',
    pencil: 'bg-amber-600',
    watercolor: 'bg-blue-500'
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="sketch-font text-sm font-medium">{label}</span>
          {showValue && (
            <span className="sketch-font text-sm text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="sketch-progress relative h-4 bg-muted rounded-sm overflow-hidden sketch-border">
        <div
          className={cn(
            'sketch-progress-bar h-full transition-all duration-500 ease-out relative overflow-hidden',
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* 铅笔纹理效果 */}
          <div className="absolute inset-0 pencil-texture opacity-30" />
          
          {/* 手绘风格的不规则边缘 */}
          <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/20 transform skew-y-12" />
        </div>
        
        {/* 手绘装饰 */}
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-xs opacity-50">
          {percentage > 10 && '✓'}
        </div>
      </div>
    </div>
  );
};