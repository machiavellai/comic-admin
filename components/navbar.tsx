"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import Image from "next/image"

export function Navbar() {
  const router = useRouter()
  const userName = localStorage.getItem("userName") || null
  const userEmail = localStorage.getItem("userEmail") || "Admin"

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/login")
  }

  return (
    <header className="border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/kingdom-logo.png" alt="Kingdom Comics" width={32} height={32} />
          <span className="comic-heading text-2xl">COMIC ADMIN</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{userName ? userName : userEmail}</span>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="comic-button gap-2">
            <LogOut className="h-5 w-5" />
            <span>LOGOUT</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
