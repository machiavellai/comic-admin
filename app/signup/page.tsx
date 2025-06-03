"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // // Check Supabase connection on mount
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }
      if (!formData.password || formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password, // Use the user-provided password
        options: {
          data: {
            name: formData.name,
            role: formData.email.includes("admin") ? "admin" : "user", // Match mobile app logic
            subscribed: false,
          },
        },
      });

      if (authError) throw authError;
      console.log("Supabase Auth response:", authData);

      // if (!authData.user) throw new Error('No user returned from signup');

      // Since email verification is disabled, the user should be logged in immediately
      const { user, session } = authData;
      if (!user || !session) {
        throw new Error("Failed to retrieve user session after signup");
      }

      // Insert user into the users table
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

      if (!existingUser) {
        const userMetadata = user.user_metadata || {};
        const { error: insertError } = await supabase.from("users").insert({
          id: user.id,
          name: userMetadata.name || "Unknown",
          email: user.email,
          image: null,
          role: userMetadata.role || "user",
          subscribed: userMetadata.subscribed || false,
        });
        if (insertError) throw insertError;
        console.log("User record created:", { id: user.id, email: user.email });
      }

      // Show success message and redirect to dashboard

      toast({
        title: 'SIGNUP SUCCESSFUL!',
        description: `Welcome to Kingdom Comics, ${formData.name}! Check your email for a magic link to log in.`,
        duration: 5000,
      });

      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
      setError(errorMessage);
      toast({
        title: 'SIGNUP ERROR',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/comic-bg-light.svg')] bg-cover p-4">
      <Card className="comic-panel p-6 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Image
            src="/kingdom-logo.png"
            alt="Kingdom Comics"
            width={100}
            height={100}
            priority
          />
        </div>
        <h1 className="comic-heading text-4xl text-black mb-6 text-center">SIGN UP</h1>
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg">Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-2 border-black h-12"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border-2 border-black h-12"
              placeholder="your@email.com"
              required
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg">Email</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="border-2 border-black h-12"
              placeholder="password"
              required
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
          <Button
            type="submit"
            className="comic-button w-full h-12 text-xl"
            disabled={isLoading}
          >
            {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
          </Button>
        </form>
      </Card>
    </div>

  )
}
