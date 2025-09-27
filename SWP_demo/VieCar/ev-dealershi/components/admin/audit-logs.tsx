"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Shield, User, FileText, CreditCard, Settings } from "lucide-react"
import { addDays } from "date-fns"

// Mock audit log data
const auditLogs = [
  {
    id: "1",
    timestamp: new Date("2025-01-20 14:30:00"),
    user: "Nguyễn Văn Manager",
    userId: "2",
    action: "APPROVE_QUOTE",
    resource: "Quote #QT-2025-001",
    resourceId: "QT-2025-001",
    details: "Phê duyệt báo giá với chiết khấu 8%",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "SUCCESS",
    module: "quotes",
  },
  {
    id: "2",
    timestamp: new Date("2025-01-20 14:15:00"),
    user: "Trần Thị Staff",
    userId: "3",
    action: "CREATE_ORDER",
    resource: "Order #ORD-2025-045",
    resourceId: "ORD-2025-045",
    details: "Tạo đơn hàng từ báo giá QT-2025-001",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "SUCCESS",
    module: "orders",
  },
  {
    id: "3",
    timestamp: new Date("2025-01-20 13:45:00"),
    user: "System",
    userId: "system",
    action: "INVENTORY_ALERT",
    resource: "VF8 Blue",
    resourceId: "vf8-blue",
    details: "Cảnh báo tồn kho thấp - còn 2 xe",
    ipAddress: "system",
    userAgent: "System Process",
    status: "WARNING",
    module: "inventory",
  },
  {
    id: "4",
    timestamp: new Date("2025-01-20 13:20:00"),
    user: "Lê Văn Customer",
    userId: "4",
    action: "BOOK_TEST_DRIVE",
    resource: "Test Drive #TD-2025-012",
    resourceId: "TD-2025-012",
    details: "Đặt lịch lái thử VF9 ngày 25/01/2025",
    ipAddress: "14.160.1.50",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
    status: "SUCCESS",
    module: "testdrives",
  },
  {
    id: "5",
    timestamp: new Date("2025-01-20 12:30:00"),
    user: "Admin System",
    userId: "1",
    action: "UPDATE_USER_ROLE",
    resource: "User Trần Thị Staff",
    resourceId: "3",
    details: "Thay đổi vai trò từ dealer_staff thành dealer_manager",
    ipAddress: "192.168.1.10",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "SUCCESS",
    module: "users",
  },
  {
    id: "6",
    timestamp: new Date("2025-01-20 11:15:00"),
    user: "Nguyễn Văn Manager",
    userId: "2",
    action: "CAPTURE_PAYMENT",
    resource: "Payment #PAY-2025-089",
    resourceId: "PAY-2025-089",
    details: "Thu tiền đặt cọc 200,000,000 VND",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "SUCCESS",
    module: "payments",
  },
  {
    id: "7",
    timestamp: new Date("2025-01-20 10:45:00"),
    user: "Trần Thị Staff",
    userId: "3",
    action: "LOGIN_FAILED",
    resource: "Authentication",
    resourceId: "auth",
    details: "Đăng nhập thất bại - sai mật khẩu",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "FAILED",
    module: "auth",
  },
]

export function AuditLogs() {
  const [filteredLogs, setFilteredLogs] = useState(auditLogs)
  const [filterModule, setFilterModule] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -7),
    to: new Date(),
  })

  const getActionIcon = (action: string) => {
    if (action.includes("USER") || action.includes("LOGIN")) return User
    if (action.includes("QUOTE") || action.includes("ORDER")) return FileText
    if (action.includes("PAYMENT")) return CreditCard
    if (action.includes("SETTING") || action.includes("UPDATE")) return Settings
    return Shield
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-500"
      case "WARNING":
        return "bg-yellow-500"
      case "FAILED":
        return "bg-red-500"
      case "ERROR":
        return "bg-red-600"
      default:
        return "bg-gray-500"
    }
  }

  const getModuleColor = (module: string) => {
    const colors = {
      quotes: "bg-blue-500",
      orders: "bg-green-500",
      payments: "bg-purple-500",
      inventory: "bg-orange-500",
      users: "bg-red-500",
      auth: "bg-gray-500",
      testdrives: "bg-teal-500",
    }
    return colors[module as keyof typeof colors] || "bg-gray-500"
  }

  const auditColumns = [
    {
      key: "timestamp" as const,
      label: "Thời gian",
      sortable: true,
      render: (value: Date) => (
        <div className="text-sm">
          <div>{value.toLocaleDateString("vi-VN")}</div>
          <div className="text-muted-foreground">{value.toLocaleTimeString("vi-VN")}</div>
        </div>
      ),
    },
    {
      key: "user" as const,
      label: "Người dùng",
      sortable: true,
    },
    {
      key: "action" as const,
      label: "Hành động",
      sortable: true,
      render: (value: string, row: any) => {
        const Icon = getActionIcon(value)
        return (
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4" />
            <span>{value}</span>
          </div>
        )
      },
    },
    {
      key: "resource" as const,
      label: "Tài nguyên",
      sortable: true,
    },
    {
      key: "module" as const,
      label: "Module",
      render: (value: string) => <Badge className={`${getModuleColor(value)} text-white`}>{value}</Badge>,
    },
    {
      key: "status" as const,
      label: "Trạng thái",
      render: (value: string) => <Badge className={`${getStatusColor(value)} text-white`}>{value}</Badge>,
    },
    {
      key: "ipAddress" as const,
      label: "IP Address",
      render: (value: string) => <span className="font-mono text-sm">{value}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Nhật ký kiểm toán</h2>
        <p className="text-muted-foreground">Theo dõi tất cả các hoạt động trong hệ thống</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Module</label>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="auth">Xác thực</SelectItem>
                  <SelectItem value="users">Người dùng</SelectItem>
                  <SelectItem value="quotes">Báo giá</SelectItem>
                  <SelectItem value="orders">Đơn hàng</SelectItem>
                  <SelectItem value="payments">Thanh toán</SelectItem>
                  <SelectItem value="inventory">Tồn kho</SelectItem>
                  <SelectItem value="testdrives">Lái thử</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="SUCCESS">Thành công</SelectItem>
                  <SelectItem value="WARNING">Cảnh báo</SelectItem>
                  <SelectItem value="FAILED">Thất bại</SelectItem>
                  <SelectItem value="ERROR">Lỗi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Khoảng thời gian</label>
              <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nhật ký hoạt động</CardTitle>
          <CardDescription>Hiển thị {filteredLogs.length} bản ghi</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredLogs}
            columns={auditColumns}
            searchable={true}
            exportable={true}
            pageSize={15}
            onRowClick={(log) => {
              // Show detailed log modal
              console.log("Show log details:", log)
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
