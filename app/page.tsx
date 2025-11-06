"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { RegistrationForm } from "@/components/registration-form"
import { Dashboard } from "@/components/dashboard"

// User object ki type define karein
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const handleLogin = (userData: User) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  const handleRegisterSuccess = () => {
    setShowRegister(false)
    alert("Registration successful! Please login.")
  }

  if (!isLoggedIn) {
    if (showRegister) {
      return <RegistrationForm onBack={() => setShowRegister(false)} onSuccess={handleRegisterSuccess} />
    }
    return <LoginForm onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} />
  }

  // User object ko Dashboard component mein pass karein
  return <Dashboard user={user} onLogout={() => { setIsLoggedIn(false); setUser(null) }} />
}