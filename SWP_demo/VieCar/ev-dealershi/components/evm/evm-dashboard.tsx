"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { RoleGuard } from "@/components/auth/role-guard"
import { useAuth } from "@/components/auth/auth-provider"
import { Factory, Truck, BarChart3, AlertTriangle, Clock, Package, Users, TrendingUp, Car, Globe } from "lucide-react"

// Mock data for EVM dashboard
const evmStats = {
  totalProduction: 2450,
  monthlyTarget: 2800,
  totalDealers: 45,
  activePromotions: 8,
  pendingAllocations: 12,
  globalInventory: 1850,
}

const productionData = [
  {
    id: "1",
    model: "VF 8",
    produced: 850,
    target: 900,
    achievement: 94,
    status: "on_track",
  },
  {
    id: "2",
    model: "VF 9",
    produced: 650,
    target: 700,
    achievement: 93,
    status: "on_track",
  },
  {
    id: "3",
    model: "VF 6",
    produced: 580,
    target: 650,
    achievement: 89,
    status: "warning",
  },
  {
    id: "4",
    model: "VF 7",
    produced: 370,
    target: 550,
    achievement: 67,
    status: "behind",
  },
]

const dealerAllocations = [
  {
    id: "1",
    dealer: "VinFast TP.HCM",
    region: "Miền Nam",
    requested: 45,
    allocated: 40,
    pending: 5,
    status: "partial",
  },
  {
    id: "2",
    dealer: "VinFast Hà Nội",
    region: "Miền Bắc",
    requested: 38,
    allocated: 38,
    pending: 0,
    status: "complete",
  },
  {
    id: "3",
    dealer: "VinFast Đà Nẵng",
    region: "Miền Trung",
    requested: 25,
    allocated: 20,
    pending: 5,
    status: "partial",
  },
]

const recentActivities = [
  {
    id: "1",
    type: "production",
    action: "Hoàn thành lô sản xuất VF8 #P2025-001",
    timestamp: "15 phút trước",
    priority: "normal",
  },
  {
    id: "2",
    type: "allocation",
    action: "Phê duyệt phân bổ 50 xe VF9 cho miền Nam",
    timestamp: "30 phút trước",
    priority: "high",
  },
  {
    id: "3",
    type: "promotion",
    action: "Tạo chương trình khuyến mãi tháng 2",
    timestamp: "1 giờ trước",
    priority: "normal",
  },
  {
    id: "4",
    type: "quality",
    action: "Cảnh báo chất lượng lô sản xuất VF7 #P2025-045",
    timestamp: "2 giờ trước",
    priority: "high",
  },
]

export function EVMDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const productionColumns = [
    {
      key: "model" as const,
      label: "Mẫu xe",
      sortable: true,
    },
    {
      key: "produced" as const,
      label: "Đã sản xuất",
      sortable: true,
      render: (value: number, row: any) => `${value}/${row.target}`,
    },
    {
      key: "achievement" as const,
      label: "Đạt được",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                value >= 90 ? "bg-green-500" : value >= 70 ? "bg-yellow-500" : "bg-red-500"
              }`}
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
          on_track: "bg-green-500",
          warning: "bg-yellow-500",
          behind: "bg-red-500",
        }
        const labels = {
          on_track: "Đúng tiến độ",
          warning: "Cảnh báo",
          behind: "Chậm tiến độ",
        }
        return (
          <Badge className={`${colors[value as keyof typeof colors]} text-white`}>
            {labels[value as keyof typeof labels]}
          </Badge>
        )
      },
    },
  ]

  const allocationColumns = [
    {
      key: "dealer" as const,
      label: "Đại lý",
      sortable: true,
    },
    {
      key: "region" as const,
      label: "Khu vực",
      sortable: true,
    },
    {
      key: "requested" as const,
      label: "Yêu cầu",
      sortable: true,
    },
    {
      key: "allocated" as const,
      label: "Đã phân bổ",
      sortable: true,
    },
    {
      key: "pending" as const,
      label: "Chờ xử lý",
      sortable: true,
    },
    {
      key: "status" as const,
      label: "Trạng thái",
      render: (value: string) => {
        const colors = {
          complete: "bg-green-500",
          partial: "bg-yellow-500",
          pending: "bg-red-500",
        }
        const labels = {
          complete: "Hoàn thành",
          partial: "Một phần",
          pending: "Chờ xử lý",
        }
        return (
          <Badge className={`${colors[value as keyof typeof colors]} text-white`}>
            {labels[value as keyof typeof labels]}
          </Badge>
        )
      },
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "normal":
        return "text-blue-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <RoleGuard roles={["evm_staff"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bảng điều khiển EVM</h1>
            <p className="text-muted-foreground">
              Chào mừng {user?.fullName} - {user?.region ? `Khu vực ${user.region}` : "Toàn quốc"}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Factory className="mr-2 h-4 w-4" />
              Kế hoạch sản xuất
            </Button>
            <Button>
              <Truck className="mr-2 h-4 w-4" />
              Phân bổ xe
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="production">Sản xuất</TabsTrigger>
            <TabsTrigger value="allocation">Phân bổ</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sản xuất tháng này</CardTitle>
                  <Factory className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{evmStats.totalProduction}</div>
                  <p className="text-xs text-muted-foreground">
                    Mục tiêu: {evmStats.monthlyTarget} (
                    {Math.round((evmStats.totalProduction / evmStats.monthlyTarget) * 100)}%)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng đại lý</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{evmStats.totalDealers}</div>
                  <p className="text-xs text-green-600">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +3 đại lý mới tháng này
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tồn kho toàn cầu</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{evmStats.globalInventory}</div>
                  <p className="text-xs text-muted-foreground">Trên toàn hệ thống</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Chờ phân bổ</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{evmStats.pendingAllocations}</div>
                  <p className="text-xs text-yellow-600">
                    <AlertTriangle className="inline h-3 w-3 mr-1" />
                    Cần xử lý
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Production Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Tình hình sản xuất</CardTitle>
                  <CardDescription>Tiến độ sản xuất theo từng mẫu xe</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable data={productionData} columns={productionColumns} searchable={false} pageSize={5} />
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                  <CardDescription>Các thao tác quan trọng trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(activity.priority)}`}>
                          {activity.priority === "high"
                            ? "Cao"
                            : activity.priority === "normal"
                              ? "Bình thường"
                              : "Thấp"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
                <CardDescription>Các tác vụ thường dùng trong ngày</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Factory className="h-6 w-6 mb-2" />
                    <span>Kế hoạch sản xuất</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Truck className="h-6 w-6 mb-2" />
                    <span>Phân bổ xe</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Car className="h-6 w-6 mb-2" />
                    <span>Quản lý danh mục</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <span>Báo cáo toàn cầu</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết sản xuất</CardTitle>
                <CardDescription>Theo dõi tiến độ sản xuất chi tiết theo từng mẫu xe</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable data={productionData} columns={productionColumns} searchable={true} exportable={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Phân bổ xe cho đại lý</CardTitle>
                <CardDescription>Quản lý yêu cầu và phân bổ xe cho các đại lý</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable data={dealerAllocations} columns={allocationColumns} searchable={true} exportable={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Báo cáo sản xuất</CardTitle>
                  <CardDescription>Tổng hợp dữ liệu sản xuất theo thời gian</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Báo cáo sản xuất sẽ được hiển thị tại đây</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Báo cáo phân bổ</CardTitle>
                  <CardDescription>Thống kê phân bổ xe theo khu vực</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Báo cáo phân bổ sẽ được hiển thị tại đây</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
