"use client"

import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { setCurrentUser, type User } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()

  const handleSuccess = (user: User) => {
    // 1) Cập nhật client session (in-memory) cho AuthProvider
    setCurrentUser(user)
    // 2) Set cookie để middleware cho phép vào route bảo vệ (SSR)
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `auth-session=mock; path=/; expires=${expires}`
    document.cookie = `role=${user.role}; path=/; expires=${expires}`
    // 3) Điều hướng về trang chủ
    router.push("/")
  }

  return <LoginForm onSuccess={handleSuccess} />
}
