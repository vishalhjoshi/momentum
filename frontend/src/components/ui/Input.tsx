
import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : '', helperText ? helperId : ''].filter(Boolean).join(' ') || undefined
          }
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-red-500">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
