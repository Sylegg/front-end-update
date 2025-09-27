"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { RoleGuard } from "@/components/auth/role-guard"
import { Users, Database, Activity, AlertTriangle, CheckCircle, Clock, UserPlus } from "lucide-react"
import { UserManagement } from "./user-management"
import { SystemSettings } from "./system-settings"
import { AuditLogs } from "./audit-logs"

// Mock data for admin dashboard
const systemStats = {
  totalUsers: 156,
  activeUsers: 142,
  totalDealers: 12,
  systemHealth: 98.5,
  pendingApprovals: 8,
  recentAlerts: 3,
}

const recentActivities = [
  {
    id: "1",
    user: "Nguyễn Văn Manager",
    action: "Phê duyệt báo giá #QT-2025-001",
    timestamp: "2025-01-20 14:30:00",
    type: "approval",
    status: "success",
  },
  {
    id: "2",
    user: "Trần Thị Staff",
    action: "Tạo đơn hàng #ORD-2025-045",
    timestamp: "2025-01-20 14:15:00",
    type: "order",
    status: "success",
  },
  {
    id: "3",
    user: "System",
    action: "Cảnh báo tồn kho thấp - VF8 màu xanh",
    timestamp: "2025-01-20 13:45:00",
    type: "alert",
    status: "warning",
  },
  {
    id: "4",
    user: "Lê Văn Customer",
    action: "Đặt lịch lái thử VF9",
    timestamp: "2025-01-20 13:20:00",
    type: "booking",
    status: "success",
  },
]

const dealerPerformance = [
  {
    id: "dealer1",
    name: "VinFast Quận 1",
    region: "TP.HCM",
    manager: "Nguyễn Văn Manager",
    totalSales: 45,
    monthlyTarget: 50,
    achievement: 90,
    status: "active",
  },
  {
    id: "dealer2",
    name: "VinFast Hà Nội",
    region: "Hà Nội",
    manager: "Trần Thị Manager",
    totalSales: 38,
    monthlyTarget: 40,
    achievement: 95,
    status: "active",
  },
  {
    id: "dealer3",
    name: "VinFast Đà Nẵng",
    region: "Đà Nẵng",
    manager: "Lê Văn Manager",
    totalSales: 22,
    monthlyTarget: 30,
    achievement: 73,
    status: "warning",
  },
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const activityColumns = [
    {
      key: "user" as const,
      label: "Người dùng",
      sortable: true,
    },
    {
      key: "action" as const,
      label: "Hành động",
      sortable: true,
    },
    {
      key: "timestamp" as const,
      label: "Thời gian",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString("vi-VN"),
    },
    {
      key: "type" as const,
      label: "Loại",
      render: (value: string) => {
        const colors = {
          approval: "bg-blue-500",
          order: "bg-green-500",
          alert: "bg-yellow-500",
          booking: "bg-purple-500",
        }
        return <Badge className={`${colors[value as keyof typeof colors]} text-white`}>{value}</Badge>
      },
    },
    {
      key: "status" as const,
      label: "Trạng thái",
      render: (value: string) => {
        const colors = {
          success: "text-green-600",
          warning: "text-yellow-600",
          error: "text-red-600",
        }
        return <span className={colors[value as keyof typeof colors]}>{value}</span>
      },
    },
  ]

  const dealerColumns = [
    {
      key: "name" as const,
      label: "Tên đại lý",
      sortable: true,
    },
    {
      key: "region" as const,
      label: "Khu vực",
      sortable: true,
    },
    {
      key: "manager" as const,
      label: "Quản lý",
      sortable: true,
    },
    {
      key: "totalSales" as const,
      label: "Doanh số",
      sortable: true,
      render: (value: number, row: any) => `${value}/${row.monthlyTarget}`,
    },
    {
      key: "achievement" as const,
      label: "Đạt được",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${value >= 90 ? "bg-green-500" : value >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
              style={{ width: `${Math.min(value, 100)}%` }}
            />
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      ),
    },
    {
      key: "status" as const,
      label: "Trạng thái",
      render: (value: string) => {
        const colors = {
          active: "bg-green-500",
          warning: "bg-yellow-500",
          inactive: "bg-red-500",
        }
        return <Badge className={`${colors[value as keyof typeof colors]} text-white`}>{value}</Badge>
      },
    },
  ]

  return (
    <RoleGuard roles={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bảng điều khiển quản trị</h1>
            <p className="text-muted-foreground">Tổng quan hệ thống và quản lý người dùng</p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Thêm người dùng
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="users">Người dùng</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
            <TabsTrigger value="audit">Kiểm toán</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">{systemStats.activeUsers} đang hoạt động</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Đại lý</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalDealers}</div>
                  <p className="text-xs text-muted-foreground">Trên toàn quốc</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sức khỏe hệ thống</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.systemHealth}%</div>
                  <p className="text-xs text-green-600">
                    <CheckCircle className="inline h-3 w-3 mr-1" />
                    Hoạt động tốt
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Chờ phê duyệt</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.pendingApprovals}</div>
                  <p className="text-xs text-yellow-600">
                    <AlertTriangle className="inline h-3 w-3 mr-1" />
                    Cần xử lý
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>Các thao tác quan trọng trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable data={recentActivities} columns={activityColumns} searchable={true} pageSize={5} />
              </CardContent>
            </Card>

            {/* Dealer Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Hiệu suất đại lý</CardTitle>
                <CardDescription>Theo dõi doanh số và mục tiêu của các đại lý</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable data={dealerPerformance} columns={dealerColumns} searchable={true} exportable={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogs />
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
