"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function LoadingAnimation() {
  const [animationStage, setAnimationStage] = useState(0)

  useEffect(() => {
    // Play sound effect when component mounts
    const audio = new Audio("/whoosh.mp3")
    audio.volume = 0.5
    audio.play().catch((e) => console.log("Audio play failed:", e))

    // Animation sequence
    const timer1 = setTimeout(() => setAnimationStage(1), 300)
    const timer2 = setTimeout(() => setAnimationStage(2), 1000)
    const timer3 = setTimeout(() => {
      setAnimationStage(3)
      // Play second sound effect
      const audio2 = new Audio("/power-up.mp3")
      audio2.volume = 0.4
      audio2.play().catch((e) => console.log("Audio play failed:", e))
    }, 1800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className="relative">
      <div className={`logo-glow ${animationStage >= 2 ? "active" : ""}`}></div>
      <Image
        src="/kingdom-logo.png"
        alt="Kingdom Comics"
        width={300}
        height={300}
        className={`logo-animation ${animationStage >= 1 ? "visible" : ""} ${animationStage >= 3 ? "pulse" : ""}`}
        priority
      />
    </div>
  )
}
