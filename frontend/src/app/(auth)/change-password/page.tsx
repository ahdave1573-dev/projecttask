"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/authcontext';
import { PROJECT_NAME } from '@/src/constants';
import { Button } from '@/src/components/common/button';
import { AuthLayout } from '@/src/components/common/AuthLayout';

export default function ChangePasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { changePassword } = useAuth();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const result = await changePassword(data);

    if (result.success) {
      setSuccessMsg('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setErrorMsg(result.message || 'Failed to update password. Please check your credentials.');
    }
    setIsLoading(false);
  };

  return (
    <AuthLayout
      title={`Change Password - ${PROJECT_NAME}`}
      description="Update your password to keep your account secure."
    >
      <div className="max-w-sm w-full mx-auto pb-4">
        <h2 className="text-[32px] font-bold text-foreground tracking-tight mb-1">Change Password</h2>

        {errorMsg && (
          <div className="mb-6 p-3 bg-error-50 border border-error-200 text-error-600 rounded-lg text-[13px] text-center font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3 bg-success-50 border border-success-200 text-success-600 rounded-lg text-[13px] text-center font-medium">
            {successMsg}
          </div>
        )}

        {!errorMsg && !successMsg && (
          <p className="text-foreground/70 mb-8 text-[15px]">Please enter your email, old password, and new password.</p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-foreground/80 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              placeholder="your email id@example.com"
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
            <label className="text-[11px] font-bold text-foreground/80 uppercase tracking-widest">Old Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("oldPassword", {
                required: "Old password is required",
              })}
              className={`w-full px-4 py-3 rounded-lg border ${errors.oldPassword ? 'border-error-500' : 'border-primary-200'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm bg-background tracking-widest`}
            />
            {errors.oldPassword && <p className="text-error-500 text-xs mt-1">{String(errors.oldPassword.message)}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-foreground/80 uppercase tracking-widest">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              className={`w-full px-4 py-3 rounded-lg border ${errors.newPassword ? 'border-error-500' : 'border-primary-200'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm bg-background tracking-widest`}
            />
            {errors.newPassword && <p className="text-error-500 text-xs mt-1">{String(errors.newPassword.message)}</p>}
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full py-3.5 shadow-lg" size="md" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Change Password'}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-[13px] text-foreground/70 font-medium">
          Remembered your password? <Link href="/login" className="font-bold text-primary hover:underline ml-1">Back to Login</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
