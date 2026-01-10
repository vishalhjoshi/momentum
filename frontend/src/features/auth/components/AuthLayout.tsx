import React from 'react';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-primary transition-colors duration-200">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
            <Logo size="lg" className="justify-center mb-6" />
          <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
          {subtitle && <p className="text-text-secondary mt-2">{subtitle}</p>}
        </div>
        <Card className="bg-bg-secondary shadow-xl border-border-color">
          {children}
        </Card>
      </div>
    </div>
  );
};
