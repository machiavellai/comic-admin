"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { LoginFormData, loginSchema } from "@/schema/auth"
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from "@/lib/supabase"
import { Session } from "@supabase/supabase-js"


export default function LoginPage() {
  const [isResending, setIsResending] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
    },
  });

  // Check initial session state
  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        setIsLoadingSession(false);
        return;
      }
      setSession(data.session);
      setIsLoadingSession(false);
    };

    fetchSession();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: 'http://localhost:3000/dashboard', // Redirect to dashboard
        },
      });

      if (error) throw error;

      toast({
        title: 'MAGIC LINK SENT!',
        description: 'Check your email for a magic link to log in.',
        duration: 5000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send magic link';
      toast({
        title: 'LOGIN ERROR',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });
      console.error('Login error:', err);
    }
  };

  const resendMagicLink = async () => {
    const email = getValues('email');
    if (!email || !email.includes('@')) {
      toast({
        title: 'INVALID EMAIL',
        description: 'Please enter a valid email address to resend the magic link.',
        variant: 'destructive',
        duration: 5000,
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'http://localhost:3000/dashboard', // Redirect to dashboard
        },
      });

      if (error) throw error;

      toast({
        title: 'MAGIC LINK RESENT!',
        description: 'Check your email for the new magic link.',
        duration: 5000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend magic link';
      toast({
        title: 'RESEND ERROR',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });
      console.error('Resend error:', err);
    } finally {
      setIsResending(false);
    }
  };

  if (isLoadingSession) {
    return <div>Loading...</div>;
  }

  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/comic-bg-light.svg')] bg-cover p-4">
      <div className="w-full max-w-md">
        <div className="speech-bubble mb-6 mx-auto w-fit">
          <h2 className="comic-heading text-2xl text-center">ADMIN ONLY!</h2>
        </div>

        <Card className="comic-panel p-6">
          <div className="mb-6 text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/kingdom-logo.png"
                alt="Kingdom Comics"
                width={100}
                height={100}
                priority
              />
            </div>
            <h1 className="comic-heading text-4xl text-black mb-2">KINGDOM COMICS ADMIN</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to access the admin panel
            </p>
          </div>

          {isLoggedIn && (
            <div className="text-center mb-4">
              <p className="text-green-600">
                You are already logged in as {session?.user.email}.{' '}
                <Button variant="link" onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}>
                  Log out
                </Button>
              </p>
              <Button onClick={() => router.push('/loading-screen')}>Go to Admin Panel</Button>
            </div>
          )}

          {!isLoggedIn && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...control.register('email')}
                  className="border-2 border-black h-12"
                  placeholder="admin@comics.com"
                  required
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="comic-button w-full h-12 text-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SENDING MAGIC LINK...' : 'ACCESS ADMIN PANEL'}
              </Button>

              <Button
                type="button"
                onClick={resendMagicLink}
                className="comic-button w-full h-12 text-xl"
                disabled={isResending || isSubmitting}
              >
                {isResending ? 'RESENDING...' : 'RESEND MAGIC LINK'}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-primary font-medium hover:underline">
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
