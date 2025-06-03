"use client";
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { Icons } from '@/components/ui/icons';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <LoginForm redirectTo={redirectTo} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/signup"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign up
          </Link>
        </p>
      </div>
    </div>
  );
} 