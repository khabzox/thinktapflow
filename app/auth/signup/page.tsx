'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { validatePassword, getPasswordStrength } from '@/lib/validatePassword';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiredErrors, setRequiredErrors] = useState<string[]>([]);
  const [optionalChecks, setOptionalChecks] = useState<{ rule: string; passed: boolean }[]>([]);
  const supabase = useSupabase();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const strength = getPasswordStrength(password);
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-400',
    'bg-green-600',
  ];

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const { requiredErrors, optionalChecks } = validatePassword(value);
    setRequiredErrors(requiredErrors);
    setOptionalChecks(optionalChecks);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { requiredErrors } = validatePassword(password);
    setRequiredErrors(requiredErrors);
    if (requiredErrors.length > 0) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      router.push('/auth/verify-email');
    } catch (error) {
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Sign up to get started with ContentSprout</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Bar */}
              <div className="h-2 w-full bg-gray-200 rounded mt-2">
                <div
                  className={`h-2 rounded transition-all ${
                    strengthColors[strength - 1] || 'bg-gray-300'
                  }`}
                  style={{ width: `${(strength / 5) * 100}%` }}
                />
              </div>

              {/* Validation Rules */}
              {password.length > 0 && (
                <>
                  {/* Required Rule */}
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mt-2">
                    <li className={requiredErrors.length === 0 ? 'text-green-600' : 'text-red-500'}>
                      At least 8 characters
                    </li>
                  </ul>

                  {/* Optional Rules */}
                  <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                    {optionalChecks.map(({ rule, passed }) => (
                      <li key={rule} className={passed ? 'text-green-500' : 'text-gray-400'}>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
