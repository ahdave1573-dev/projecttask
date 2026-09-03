"use client";

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/src/contexts/authcontext';
import { PROJECT_NAME } from '@/src/constants';
import { Button } from '@/src/components/common/button';
import { AuthLayout } from '@/src/components/common/AuthLayout';

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");
  const { registerUser } = useAuth();
  const [registerError, setRegisterError] = React.useState('');

  const onSubmit = async (data: any) => {
    setRegisterError('');
    const result = await registerUser(data);
    if (result && !result.success) {
      setRegisterError(result.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      title={`Join ${PROJECT_NAME} Today`}
      description="Create an account to start tracking lists, managing projects, and collaborating with your team."
    >
      <div className="max-w-sm w-full mx-auto pb-4">
        <h2 className="text-[26px] sm:text-[28px] font-bold text-foreground tracking-tight mb-1">Create Account</h2>

        {registerError ? (
          <div className="mb-4 p-2.5 bg-error-50 border border-error-200 text-error-600 rounded-lg text-[13px] text-center font-medium">
            {registerError}
          </div>
        ) : (
          <p className="text-foreground/70 mb-5 text-[13px] sm:text-[14px]">Please enter your details to register.</p>
        )}

        <form className="flex flex-col gap-1.5" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3">
            <div className="relative pb-4.5 w-1/2">
              <label className="block text-[10px] font-bold text-foreground/80 uppercase tracking-widest mb-1">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                {...register("firstName", { required: "First Name is required" })}
                className={`w-full px-3 py-2.5 rounded-lg border ${errors.firstName ? 'border-error-500' : 'border-primary-200'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[13px] bg-background`}
              />
              {errors.firstName && <p className="text-error-500 text-[11px] absolute bottom-0 left-1">{String(errors.firstName.message)}</p>}
            </div>

            <div className="relative pb-4.5 w-1/2">
              <label className="block text-[10px] font-bold text-foreground/80 uppercase tracking-widest mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastName", { required: "Last Name is required" })}
                className={`w-full px-3 py-2.5 rounded-lg border ${errors.lastName ? 'border-error-500' : 'border-primary-200'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[13px] bg-background`}
              />
              {errors.lastName && <p className="text-error-500 text-[11px] absolute bottom-0 left-1">{String(errors.lastName.message)}</p>}
            </div>
          </div>

          <div className="relative pb-4.5">
            <label className="block text-[10px] font-bold text-foreground/80 uppercase tracking-widest mb-1">Email Address</label>
            <input
              type="email"
              placeholder="username@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className={`w-full px-3 py-2.5 rounded-lg border ${errors.email ? 'border-error-500' : 'border-primary-200'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[13px] bg-background`}
            />
            {errors.email && <p className="text-error-500 text-[11px] absolute bottom-0 left-1">{String(errors.email.message)}</p>}
          </div>

          <div className="relative pb-4.5">
            <label className="block text-[10px] font-bold text-foreground/80 uppercase tracking-widest mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must have at least 6 characters"
                }
              })}
              className={`w-full px-3 py-2.5 rounded-lg border ${errors.password ? 'border-error-500' : 'border-primary-200'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[13px] bg-background tracking-widest`}
            />
            {errors.password && <p className="text-error-500 text-[11px] absolute bottom-0 left-1">{String(errors.password.message)}</p>}
          </div>

          <div className="relative pb-4.5">
            <label className="block text-[10px] font-bold text-foreground/80 uppercase tracking-widest mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value => value === password || "The passwords do not match"
              })}
              className={`w-full px-3 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-error-500' : 'border-primary-200'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[13px] bg-background tracking-widest`}
            />
            {errors.confirmPassword && <p className="text-error-500 text-[11px] absolute bottom-0 left-1">{String(errors.confirmPassword.message)}</p>}
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full py-3 shadow-md text-[14px]" size="md">
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-5 text-center text-[13px] text-foreground/70 font-medium">
          Already have an account? <Link href="/login" className="font-bold text-primary hover:underline ml-1">Sign In</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
