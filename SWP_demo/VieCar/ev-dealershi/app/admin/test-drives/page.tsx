"use client"

// DEPRECATED: This standalone admin test-drives page has been superseded by the
// tab-based Admin Portal (Bookings/Test Drives tab). We keep this file temporarily
// to avoid 404s and redirect to /admin. Safe to delete once deep links are updated.
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminTestDrivesRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/admin")
  }, [router])
  return null
}
