
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';
import { forgotPasswordSchema } from '../types';
import { authApi } from '@/lib/api/auth';

export default function ForgotPasswordPage() {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setIsSuccess(true);
      addToast('Reset link sent!', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email.';
      setError(message);
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle={`We've sent a password reset link to ${email}`}
      >
        <div className="space-y-6">
          <p className="text-sm text-text-secondary">
            Did not receive the email? Check your spam folder or try another email address.
          </p>
          <Button
            variant="ghost"
            onClick={() => setIsSuccess(false)}
            className="w-full"
          >
            Try another email
          </Button>
          <div className="text-center">
             <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
               Back to sign in
             </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email to receive a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => {
              setEmail(e.target.value);
              if(error) setError('');
          }}
          error={error}
          disabled={isLoading}
        />

        <Button
          type="submit"
          className="w-full mt-6"
          isLoading={isLoading}
        >
          Send Reset Link
        </Button>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
