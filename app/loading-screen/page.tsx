"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingAnimation } from "@/components/loading-animation"

export default function LoadingScreen() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <LoadingAnimation />
      <h1 className="mt-6 text-white font-bangers text-4xl tracking-wider animate-pulse">KINGDOM COMICS</h1>
    </div>
  )
}
