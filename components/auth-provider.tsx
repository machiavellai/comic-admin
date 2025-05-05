"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  userEmail: string | null
  userName: string | null
  login: (email: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const email = localStorage.getItem("userEmail")
    const name = localStorage.getItem("userName")

    setIsAuthenticated(loggedIn)
    setUserEmail(email)
    setUserName(name)
    setIsLoading(false)

    const publicPaths = ["/login", "/signup", "/loading-screen"]
    if (!loggedIn && !publicPaths.includes(pathname) && !isLoading) {
      router.push("/login")
    }
  }, [pathname, router, isLoading])

  const login = async (email: string) => {
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userEmail", email)
    setIsAuthenticated(true)
    setUserEmail(email)
    router.push("/loading-screen")
  }

  const signup = async (name: string, email: string, password: string) => {
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userEmail", email)
    localStorage.setItem("userName", name)
    setIsAuthenticated(true)
    setUserEmail(email)
    setUserName(name)
    router.push("/loading-screen")
  }

  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    setIsAuthenticated(false)
    setUserEmail(null)
    setUserName(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, userName, login, signup, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
