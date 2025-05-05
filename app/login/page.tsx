"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "INVALID EMAIL",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      setIsLoading(false)
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", email)

      // Show success toast
      toast({
        title: "LOGIN SUCCESSFUL!",
        description: "Welcome back to Kingdom Comics!",
        duration: 5000,
      })

      // Redirect to loading screen instead of dashboard
      router.push("/loading-screen")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/comic-bg-light.svg')] bg-cover p-4">
      <div className="w-full max-w-md">
        <div className="speech-bubble mb-6 mx-auto w-fit">
          <h2 className="comic-heading text-2xl text-center">ADMIN ONLY!</h2>
        </div>

        <Card className="comic-panel p-6">
          <div className="mb-6 text-center">
            <div className="flex justify-center mb-4">
              <Image src="/kingdom-logo.png" alt="Kingdom Comics" width={100} height={100} priority />
            </div>
            <h1 className="comic-heading text-4xl text-black mb-2">KINGDOM COMICS ADMIN</h1>
            <p className="text-sm text-muted-foreground">Enter your email to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-black h-12"
                placeholder="admin@comics.com"
                required
              />
            </div>

            <Button type="submit" className="comic-button w-full h-12 text-xl" disabled={isLoading}>
              {isLoading ? "LOGGING IN..." : "ACCESS ADMIN PANEL"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary font-medium hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
