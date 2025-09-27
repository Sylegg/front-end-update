"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"
import type { User as AuthUser } from "@/lib/auth"

interface HeaderProps {
  user: AuthUser
  activeModule: string
}

export function Header({ user, activeModule }: HeaderProps) {
  const { logout } = useAuth()

  const getModuleTitle = (module: string) => {
    const titles: Record<string, string> = {
      dashboard: "Tổng quan",
      catalog: "Danh mục sản phẩm",
      inventory: "Quản lý tồn kho",
      customers: "Quản lý khách hàng",
      testdrives: "Quản lý lái thử",
      quotes: "Quản lý báo giá",
      orders: "Quản lý đơn hàng",
      payments: "Quản lý thanh toán",
      promotions: "Quản lý khuyến mãi",
      complaints: "Quản lý khiếu nại",
      reports: "Báo cáo",
      settings: "Cài đặt hệ thống",
      audit: "Nhật ký kiểm toán",
    }
    return titles[module] || "VinFast RBAC System"
  }

  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{getModuleTitle(activeModule)}</h1>
          <p className="text-sm text-muted-foreground">Chào mừng, {user.fullName}</p>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4 mr-2" />
              {user.fullName}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
