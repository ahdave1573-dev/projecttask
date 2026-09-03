"use client";

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/src/contexts/authcontext';
import { PROJECT_NAME } from '@/src/constants';
import { Button } from '@/src/components/common/button';
import { AuthLayout } from '@/src/components/common/AuthLayout';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [loginError, setLoginError] = React.useState('');

  const onSubmit = async (data: any) => {
    setLoginError('');
    const result = await login(data);
    if (!result.success) {
      setLoginError(result.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <AuthLayout
      title={`Welcome Back to ${PROJECT_NAME}`}
      description="Streamline your projects and boost productivity effortlessly. Sign in to continue your journey."
    >
      <div className="max-w-sm w-full mx-auto pb-4">
        <h2 className="text-[32px] font-bold text-foreground tracking-tight mb-1">Sign In</h2>

        {loginError ? (
          <div className="mb-8 p-3 bg-error-50 border border-error-200 text-error-600 rounded-lg text-[13px] text-center font-medium">
            {loginError}
          </div>
        ) : (
          <p className="text-foreground/70 mb-8 text-[15px]">Please enter your details to sign in.</p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-foreground/80 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              placeholder="user email id@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-error-500' : 'border-primary-200'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm bg-background`}
            />
            {errors.email && <p className="text-error-500 text-xs mt-1">{String(errors.email.message)}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-foreground/80 uppercase tracking-widest">Password</label>
              <Link href="/change-password" className="text-[11px] font-bold text-primary hover:text-primary-700 transition-colors">Forgot Password?</Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Invalid password"
                }
              })}
              className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-error-500' : 'border-primary-200'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm bg-background tracking-widest`}
            />
            {errors.password && <p className="text-error-500 text-xs mt-1">{String(errors.password.message)}</p>}
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full py-3.5 shadow-lg" size="md">
              Sign In
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-[13px] text-foreground/70 font-medium">
          Don't have an account? <Link href="/register" className="font-bold text-primary hover:underline ml-1">Sign Up</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
