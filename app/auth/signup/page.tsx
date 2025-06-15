"use client"
import Link from "next/link"
import Image from "next/image"
import { SignupForm } from "@/components/auth/SignupForm"

import coverImage from '/public/assets/dark-auth-page.jpg';

export default function SignupPage() {
  return (
    <div className="w-full bg-background lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Signup Form Section */}
      <div className="flex items-center justify-center py-12 lg:py-0">
        <div className="mx-auto w-full max-w-sm space-y-6 px-6">
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Image src="/logo/logosaas-dark.png" alt="logo" width={100} height={100} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-secondary-foreground/90">Enter your details to get started</p>
          </div>

          <SignupForm />

          <div className="text-center">
            <p className="text-sm text-secondary-foreground/90">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-popover-foreground underline underline-offset-4 hover:text-primary/80"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden bg-muted lg:block relative">
        <Image
          src={coverImage}
          alt="Signup cover image"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
