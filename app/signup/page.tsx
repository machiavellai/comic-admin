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
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
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
        throw new Error('Name is required');
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: Math.random().toString(36).slice(-8), // Temporary password (required by Supabase)
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_APP_URL
            ? `${process.env.NEXT_PUBLIC_APP_URL}/login`
            : `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, // Use env variable for deployed URL
          data: {
            name: formData.name,
            role: 'admin', // Default to 'user'; admins can be assigned manually
            subscribed: false,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');

      // Insert user into the users table
      const { error: insertError } = await supabase.from('users').insert({
        id: authData.user.id,
        name: formData.name,
        email: formData.email,
        role: 'admin', // Default to 'user'
        subscribed: false,
      });

      if (insertError) throw insertError;

      // Send magic link for email verification
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_APP_URL
            ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
            : 'http://localhost:3000/dashboard',
        },
      });

      if (otpError) throw otpError;

      toast({
        title: 'SIGNUP SUCCESSFUL!',
        description: `Welcome to Kingdom Comics, ${formData.name}! Check your email for a magic link to log in.`,
        duration: 5000,
      });

      router.push('/login');
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
    // <div className="min-h-screen flex items-center justify-center bg-[url('/comic-bg-light.svg')] bg-cover p-4">
    //   <div className="w-full max-w-md">
    //     <div className="speech-bubble mb-6 mx-auto w-fit">
    //       <h2 className="comic-heading text-2xl text-center">CREATE ADMIN ACCOUNT!</h2>
    //     </div>

    //     <Card className="comic-panel p-6">
    //       <div className="mb-6 text-center">
    //         <div className="flex justify-center mb-4">
    //           <Image src="/kingdom-logo.png" alt="Kingdom Comics" width={100} height={100} priority />
    //         </div>
    //         <h1 className="comic-heading text-4xl text-black mb-2">KINGDOM COMICS ADMIN</h1>
    //         <p className="text-sm text-muted-foreground">Create your admin account to manage comics</p>
    //       </div>

    //       {/* Display connection status */}
    //       {connectionStatus && (
    //         <p
    //           className={`text-sm text-center mb-4 ${connectionStatus.includes('Failed') ? 'text-destructive' : 'text-green-600'
    //             }`}
    //         >
    //           {connectionStatus}
    //         </p>
    //       )}

    //       <form onSubmit={handleSignup} className="space-y-4">
    //         <div className="space-y-2">
    //           <Label htmlFor="name" className="text-lg">
    //             Name
    //           </Label>
    //           <Input
    //             id="name"
    //             name="name"
    //             value={formData.name}
    //             onChange={handleChange}
    //             className="border-2 border-black h-12"
    //             placeholder="John Doe"
    //             required
    //           />
    //         </div>

    //         <div className="space-y-2">
    //           <Label htmlFor="email" className="text-lg">
    //             Email
    //           </Label>
    //           <Input
    //             id="email"
    //             name="email"
    //             type="email"
    //             value={formData.email}
    //             onChange={handleChange}
    //             className="border-2 border-black h-12"
    //             placeholder="admin@comics.com"
    //             required
    //           />
    //         </div>
    //         <div className="space-y-2">
    //           <Label htmlFor="email" className="text-lg">
    //             Password
    //           </Label>
    //           <Input
    //             id="password"
    //             name="password"
    //             type="password"
    //             value={formData.password}
    //             onChange={handleChange}
    //             className="border-2 border-black h-12"
    //             placeholder="enter your password"
    //             required
    //           />
    //         </div>

    //         {error && <p className="text-destructive text-sm">{error}</p>}

    //         <Button
    //           type="submit"
    //           className="comic-button w-full h-12 text-xl mt-6"
    //           disabled={isLoading || connectionStatus?.includes('Failed')}
    //         >
    //           {isLoading ? 'SENDING MAGIC LINK...' : 'SIGN UP WITH MAGIC LINK'}
    //         </Button>

    //         <div className="text-center mt-4">
    //           <p className="text-sm text-muted-foreground">
    //             Already have an account?{' '}
    //             <Link href="/login" className="text-primary font-medium hover:underline">
    //               Login here
    //             </Link>
    //           </p>
    //         </div>
    //       </form>
    //     </Card>
    //   </div>
    // </div>
  )
}
