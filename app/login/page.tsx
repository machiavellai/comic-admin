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
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "", // Added password field
    },
  });
  // Check initial session state
  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        setIsLoadingSession(false);
        return;
      }
      setSession(data.session);
      setIsLoadingSession(false);

      // If user is logged in, redirect to dashboard
      if (data.session) {
        router.push("/dashboard");
      }
    };

    fetchSession();

    // Listen for auth state changes (simplified for password-based login)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === "SIGNED_IN") {
        router.push("/dashboard");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Starting login process with data:", data);

      // Sign in with email and password
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      console.log("Supabase Auth response:", authData);

      // Check if user and session are returned
      const { user, session } = authData;
      if (!user || !session) {
        throw new Error("Failed to retrieve user session after login");
      }

      // Success message and redirect (handled by useEffect listener)
      toast({
        title: "LOGIN SUCCESSFUL!",
        description: `Welcome back, ${user.email}!`,
        duration: 5000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to log in";
      toast({
        title: "LOGIN ERROR",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      console.error("Login error:", err);
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
              Enter your credentials to access the admin panel
            </p>
          </div>

          {isLoggedIn && (
            <div className="text-center mb-4">
              <p className="text-green-600">
                You are already logged in as {session?.user.email}.{" "}
                <Button variant="link" onClick={() => supabase.auth.signOut().then(() => router.push("/login"))}>
                  Log out
                </Button>
              </p>
              <Button onClick={() => router.push("/loading-screen")}>Go to Admin Panel</Button>
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
                  {...register("email")}
                  className="border-2 border-black h-12"
                  placeholder="admin@comics.com"
                  required
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="border-2 border-black h-12"
                  placeholder="password"
                  required
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="comic-button w-full h-12 text-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "LOGGING IN..." : "ACCESS ADMIN PANEL"}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
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
