"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  return match ? decodeURIComponent(match[2]) : null
}

export function SiteHeader() {
  const [hasSession, setHasSession] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const session = getCookie("auth-session")
    const r = getCookie("role")
    setHasSession(!!session)
    setRole(r)
  }, [])

  const handleLogout = () => {
    const past = new Date(0).toUTCString()
    document.cookie = `auth-session=; expires=${past}; path=/`
    document.cookie = `role=; expires=${past}; path=/`
    window.location.href = "/"
  }

  return (
    <header className="w-full border-b bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-semibold">VinFast</Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/">Trang chủ</Link>
            {hasSession && (
              <Link href="/dashboard">Dashboard</Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {!hasSession ? (
            <Link href="/login">
              <Button size="sm">Đăng nhập</Button>
            </Link>
          ) : (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <Button size="sm" variant="destructive" onClick={handleLogout}>Đăng xuất</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
