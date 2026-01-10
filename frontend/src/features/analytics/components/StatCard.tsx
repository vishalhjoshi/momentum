
import React from 'react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export function StatCard({ label, value, subtext, icon, color = 'bg-primary-50 dark:bg-primary-900/20' }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 transition-transform hover:scale-105">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-text-secondary font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
        {subtext && <p className="text-xs text-text-tertiary">{subtext}</p>}
      </div>
    </Card>
  );
}
