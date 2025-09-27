"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { TestDriveManagement } from "@/components/dealer/test-drive-management"
import { hasPermission } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function DealerTestDrivesPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Yêu cầu đăng nhập</h2>
            <p className="text-muted-foreground">Vui lòng đăng nhập để truy cập trang này.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasPermission("testdrives.read", user)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không có quyền truy cập</h2>
            <p className="text-muted-foreground">Bạn không có quyền truy cập chức năng quản lý lái thử.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TestDriveManagement />
    </div>
  )
}
