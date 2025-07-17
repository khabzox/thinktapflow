"use client";
import { Suspense } from "react";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

// Separate component that uses useSearchParams
function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.mail className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            {email ? (
              <>
                We&apos;ve sent a verification link to{" "}
                <span className="font-semibold">{email}</span>
              </>
            ) : (
              "We&apos;ve sent you a verification link"
            )}
          </p>
        </div>

        <div className="grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">While you wait</span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Make sure to check your spam folder if you don&apos;t see the email in your inbox.
            </p>
          </div>

          <Button variant="outline" asChild>
            <Link href="/auth/login">
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function VerifyLoading() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.mail className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyContent />
    </Suspense>
  );
}
