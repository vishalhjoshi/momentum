
import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';
import { resetPasswordSchema } from '../types';
import { authApi } from '@/lib/api/auth';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!token) {
    return (
      <AuthLayout title="Invalid Link" subtitle="This password reset link is invalid or expired.">
        <div className="text-center">
            <Link to="/forgot-password">
                <Button className="w-full">Request new link</Button>
            </Link>
        </div>
      </AuthLayout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = resetPasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(token, result.data.password);
      addToast('Password reset successfully! Please login.', 'success');
      navigate('/login');
    } catch (error) {
       if (error instanceof Error) {
         addToast(error.message, 'error');
       } else {
         addToast('Failed to reset password. Link may be expired.', 'error');
       }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Your new password must be different to previously used passwords"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isLoading}
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isLoading}
        />

        <Button
          type="submit"
          className="w-full mt-6"
          isLoading={isLoading}
        >
          Reset Password
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
