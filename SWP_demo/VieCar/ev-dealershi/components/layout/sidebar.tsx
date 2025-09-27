"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { hasPermission } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Car,
  Users,
  FileText,
  Calendar,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Package,
  Gift,
  MessageSquare,
  Shield,
} from "lucide-react"

interface SidebarProps {
  activeModule: string
  onModuleChange: (module: string) => void
}

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!user) return null

  const menuItems = [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: Home,
      module: "dashboard",
      roles: ["dealer_staff", "dealer_manager", "evm_staff", "admin"],
    },
    {
      id: "catalog",
      label: "Danh mục sản phẩm",
      icon: Car,
      module: "catalog",
      permissions: ["catalog.read"],
    },
    {
      id: "inventory",
      label: "Tồn kho",
      icon: Package,
      module: "inventory",
      permissions: ["inventory.read"],
    },
    {
      id: "customers",
      label: "Khách hàng",
      icon: Users,
      module: "customers",
      permissions: ["customers.read"],
    },
    {
      id: "testdrives",
      label: "Lái thử",
      icon: Calendar,
      module: "testdrives",
      permissions: ["testdrives.read"],
    },
    {
      id: "quotes",
      label: "Báo giá",
      icon: FileText,
      module: "quotes",
      permissions: ["quotes.read"],
    },
    {
      id: "orders",
      label: "Đơn hàng",
      icon: FileText,
      module: "orders",
      permissions: ["orders.read"],
    },
    {
      id: "payments",
      label: "Thanh toán",
      icon: CreditCard,
      module: "payments",
      permissions: ["payments.read"],
    },
    {
      id: "promotions",
      label: "Khuyến mãi",
      icon: Gift,
      module: "promotions",
      permissions: ["promotions.read"],
    },
    {
      id: "complaints",
      label: "Khiếu nại",
      icon: MessageSquare,
      module: "complaints",
      roles: ["dealer_staff", "dealer_manager", "evm_staff", "admin"],
    },
    {
      id: "reports",
      label: "Báo cáo",
      icon: BarChart3,
      module: "reports",
      permissions: ["reports.read.self", "reports.read.dealer", "reports.read.global"],
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: Settings,
      module: "settings",
      permissions: ["settings.users.read", "settings.integrations.manage", "settings.policies.manage"],
    },
    {
      id: "audit",
      label: "Nhật ký kiểm toán",
      icon: Shield,
      module: "audit",
      permissions: ["audit.read"],
    },
  ]

  const visibleItems = menuItems.filter((item) => {
    if (item.roles) {
      return item.roles.includes(user.role)
    }
    if (item.permissions) {
      return item.permissions.some((permission) => hasPermission(permission, user))
    }
    return true
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "evm_staff":
        return "bg-purple-500"
      case "dealer_manager":
        return "bg-blue-500"
      case "dealer_staff":
        return "bg-green-500"
      case "customer":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên"
      case "evm_staff":
        return "Nhân viên EVM"
      case "dealer_manager":
        return "Quản lý đại lý"
      case "dealer_staff":
        return "Nhân viên đại lý"
      case "customer":
        return "Khách hàng"
      default:
        return "Khách"
    }
  }

  return (
    <div className={`bg-card border-r transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <Car className="h-6 w-6 text-primary" />
                <span className="font-bold">VinFast RBAC</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b">
          {!isCollapsed ? (
            <div className="space-y-2">
              <p className="font-medium text-sm truncate">{user.fullName}</p>
              <Badge className={`text-xs ${getRoleBadgeColor(user.role)} text-white`}>{getRoleLabel(user.role)}</Badge>
              {user.dealerId && <p className="text-xs text-muted-foreground">Đại lý: {user.dealerId}</p>}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className={`w-8 h-8 rounded-full ${getRoleBadgeColor(user.role)} flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">{user.fullName.charAt(0)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive = activeModule === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${isCollapsed ? "px-2" : ""}`}
                onClick={() => onModuleChange(item.id)}
              >
                <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-2"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            )
          })}
        </nav>

        <Separator />

        {/* Logout */}
        <div className="p-4">
          <Button
            variant="ghost"
            className={`w-full justify-start text-destructive hover:text-destructive ${isCollapsed ? "px-2" : ""}`}
            onClick={logout}
          >
            <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-2"}`} />
            {!isCollapsed && <span>Đăng xuất</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
