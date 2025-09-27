"use client"

import type React from "react"

import { useAuth } from "./auth-provider"
import { hasPermission, hasAnyPermission, type UserRole } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldX } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  roles?: UserRole[]
  permissions?: string[]
  requireAll?: boolean
  fallback?: React.ReactNode
}

export function RoleGuard({ children, roles, permissions, requireAll = false, fallback }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user) {
    return (
      fallback || (
        <Alert variant="destructive">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>Bạn cần đăng nhập để truy cập tính năng này.</AlertDescription>
        </Alert>
      )
    )
  }

  // Check role access
  if (roles && !roles.includes(user.role)) {
    return (
      fallback || (
        <Alert variant="destructive">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>
            Bạn không có quyền truy cập tính năng này. Yêu cầu vai trò: {roles.join(", ")}
          </AlertDescription>
        </Alert>
      )
    )
  }

  // Check permission access
  if (permissions) {
    const hasAccess = requireAll
      ? permissions.every((p) => hasPermission(p, user))
      : hasAnyPermission(permissions, user)

    if (!hasAccess) {
      return (
        fallback || (
          <Alert variant="destructive">
            <ShieldX className="h-4 w-4" />
            <AlertDescription>Bạn không có quyền thực hiện thao tác này.</AlertDescription>
          </Alert>
        )
      )
    }
  }

  return <>{children}</>
}
