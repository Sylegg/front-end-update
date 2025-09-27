"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoleGuard } from "@/components/auth/role-guard"
import { useAuth } from "@/components/auth/auth-provider"
import { Users, Calendar, FileText, Car, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { CustomerManagement } from "./customer-management"
import { TestDriveManagement } from "./test-drive-management"
import { InventoryView } from "./inventory-view"

// Mock data for dealer dashboard
const dashboardStats = {
  totalCustomers: 156,
  activeLeads: 23,
  testDrivesToday: 8,
  quotesThisMonth: 45,
  ordersThisMonth: 32,
  conversionRate: 71,
}

const recentActivities = [
  {
    id: "1",
    type: "lead",
    customer: "Nguyễn Văn A",
    action: "Khách hàng mới quan tâm VF8",
    timestamp: "10 phút trước",
    priority: "high",
  },
  {
    id: "2",
    type: "testdrive",
    customer: "Trần Thị B",
    action: "Hoàn thành lái thử VF9",
    timestamp: "30 phút trước",
    priority: "medium",
  },
  {
    id: "3",
    type: "quote",
    customer: "Lê Văn C",
    action: "Yêu cầu báo giá VF6",
    timestamp: "1 giờ trước",
    priority: "medium",
  },
  {
    id: "4",
    type: "followup",
    customer: "Phạm Thị D",
    action: "Cần gọi lại sau lái thử",
    timestamp: "2 giờ trước",
    priority: "high",
  },
]

const todayTasks = [
  {
    id: "1",
    type: "call",
    customer: "Nguyễn Văn E",
    task: "Gọi tư vấn sau lái thử VF8",
    time: "14:00",
    status: "pending",
  },
  {
    id: "2",
    type: "meeting",
    customer: "Trần Thị F",
    task: "Hẹn ký hợp đồng VF9",
    time: "15:30",
    status: "pending",
  },
  {
    id: "3",
    type: "delivery",
    customer: "Lê Văn G",
    task: "Giao xe VF6 màu đỏ",
    time: "16:00",
    status: "completed",
  },
]

export function DealerDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <RoleGuard roles={["dealer_staff", "dealer_manager"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bảng điều khiển bán hàng</h1>
            <p className="text-muted-foreground">
              Chào mừng {user?.fullName} - {user?.dealerId ? `Đại lý ${user.dealerId}` : ""}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Lịch hẹn
            </Button>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Khách hàng mới
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="customers">Khách hàng</TabsTrigger>
            <TabsTrigger value="testdrives">Lái thử</TabsTrigger>
            <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">{dashboardStats.activeLeads} lead đang theo dõi</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lái thử hôm nay</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.testDrivesToday}</div>
                  <p className="text-xs text-green-600">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +2 so với hôm qua
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Báo giá tháng này</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.quotesThisMonth}</div>
                  <p className="text-xs text-muted-foreground">{dashboardStats.ordersThisMonth} đã thành đơn</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tỷ lệ chuyển đổi</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.conversionRate}%</div>
                  <p className="text-xs text-green-600">Tốt hơn mục tiêu 65%</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                  <CardDescription>Các tương tác khách hàng mới nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.customer}</p>
                          <p className="text-sm text-muted-foreground">{activity.action}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(activity.priority)}`}>
                            {activity.priority === "high"
                              ? "Cao"
                              : activity.priority === "medium"
                                ? "Trung bình"
                                : "Thấp"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Công việc hôm nay</CardTitle>
                  <CardDescription>Lịch trình và nhiệm vụ cần hoàn thành</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todayTasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-4">
                        {getTaskStatusIcon(task.status)}
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{task.customer}</p>
                          <p className="text-sm text-muted-foreground">{task.task}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{task.time}</p>
                          <Badge variant={task.status === "completed" ? "default" : "secondary"}>
                            {task.status === "completed" ? "Hoàn thành" : "Chờ xử lý"}
                          </Badge>
                        </div>
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
                    <Users className="h-6 w-6 mb-2" />
                    <span>Thêm khách hàng</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Calendar className="h-6 w-6 mb-2" />
                    <span>Đặt lịch lái thử</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <FileText className="h-6 w-6 mb-2" />
                    <span>Tạo báo giá</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent">
                    <Car className="h-6 w-6 mb-2" />
                    <span>Kiểm tra tồn kho</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <CustomerManagement />
          </TabsContent>

          <TabsContent value="testdrives">
            <TestDriveManagement />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryView />
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
