import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label className={cn("inline-flex items-center cursor-pointer group", className)}>
         <div className="relative">
          <input
            type="checkbox"
            className="sr-only peer"
            ref={ref}
            {...props}
          />
          {/* Track */}
          <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-secondary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
        </div>
        
        {(label || description) && (
             <div className="ms-3 text-sm">
                {label && <span className="font-medium text-text-primary block">{label}</span>}
                {description && <span className="text-text-secondary text-xs">{description}</span>}
            </div>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
