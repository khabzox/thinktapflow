"use client";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";
import { useSearchParams } from "next/navigation";

import coverImage from "/public/assets/dark-auth-page.jpg";

// Separate component that uses useSearchParams
function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  return (
    <div className="w-full bg-background lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Login Form Section */}
      <div className="flex items-center justify-center py-12 lg:py-0">
        <div className="mx-auto w-full max-w-sm space-y-6 px-6">
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Image src="/logo/logosaas-dark.png" alt="logo" width={100} height={100} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-secondary-foreground/90">
              Enter your credentials to access your account
            </p>
          </div>

          <LoginForm redirectTo={redirectTo} />

          <div className="text-center">
            <p className="text-sm text-secondary-foreground/90">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative hidden bg-muted lg:block">
        <Image src={coverImage} alt="Login cover image" fill className="object-cover" priority />
      </div>
    </div>
  );
}

// Loading fallback component
function LoginLoading() {
  return (
    <div className="w-full bg-background lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 lg:py-0">
        <div className="mx-auto w-full max-w-sm space-y-6 px-6">
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Image src="/logo/logosaas-dark.png" alt="logo" width={100} height={100} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-secondary-foreground/90">Loading...</p>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Login cover image"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}
