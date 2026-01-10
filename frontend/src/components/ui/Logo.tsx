import React from 'react';
import { cn } from '@/lib/utils';
import logoUrl from '@/assets/logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const textClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img 
        src={logoUrl} 
        alt="Momentum Logo" 
        className={cn("object-contain", sizeClasses[size])}
      />
      {showText && (
        <span className={cn(
          "font-bold text-primary-900 dark:text-primary-100", 
          textClasses[size]
        )}>
          Momentum
        </span>
      )}
    </div>
  );
};
