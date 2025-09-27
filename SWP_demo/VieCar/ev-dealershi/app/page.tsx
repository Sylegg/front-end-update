"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"

// Minimal public homepage with hero section

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  return match ? decodeURIComponent(match[2]) : null
}

export default function Homepage() {
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    setHasSession(!!getCookie("auth-session"))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Nền tảng quản lý VinFast</h1>
            <p className="mt-4 text-muted-foreground">
              Quản lý lái thử, báo giá, đơn hàng, tồn kho và khuyến mãi — tất cả trong một trang tổng quan.
            </p>
            <div className="mt-6 flex gap-3">
              {!hasSession ? (
                <Link href="/login">
                  <Button size="lg">Đăng nhập</Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button size="lg">Vào Dashboard</Button>
                </Link>
              )}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border bg-card">
            <img src="/vinfast-electric-vehicle-hero-image-modern.jpg" alt="VinFast" className="w-full h-auto" />
          </div>
        </section>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} VinFast</footer>
    </div>
  )
}
