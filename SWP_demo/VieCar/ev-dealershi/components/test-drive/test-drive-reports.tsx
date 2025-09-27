"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Download, Calendar, Car, Users, Target } from "lucide-react"

// Mock data for charts
const monthlyData = [
  { month: "T1", bookings: 45, completed: 38, conversion: 84 },
  { month: "T2", bookings: 52, completed: 44, conversion: 85 },
  { month: "T3", bookings: 48, completed: 41, conversion: 85 },
  { month: "T4", bookings: 61, completed: 53, conversion: 87 },
  { month: "T5", bookings: 55, completed: 48, conversion: 87 },
  { month: "T6", bookings: 67, completed: 59, conversion: 88 },
]

const vehicleData = [
  { name: "VF8", value: 35, color: "#3b82f6" },
  { name: "VF9", value: 28, color: "#10b981" },
  { name: "VF7", value: 22, color: "#f59e0b" },
  { name: "VF6", value: 15, color: "#ef4444" },
]

const showroomData = [
  { showroom: "Quận 1", bookings: 45, completed: 39, rate: 87 },
  { showroom: "Quận 7", bookings: 38, completed: 33, rate: 87 },
  { showroom: "Thủ Đức", bookings: 32, completed: 28, rate: 88 },
  { showroom: "Bình Thạnh", bookings: 25, completed: 21, rate: 84 },
]

const conversionData = [
  { month: "T1", testDrives: 38, purchases: 12, rate: 32 },
  { month: "T2", testDrives: 44, purchases: 15, rate: 34 },
  { month: "T3", testDrives: 41, purchases: 14, rate: 34 },
  { month: "T4", testDrives: 53, purchases: 19, rate: 36 },
  { month: "T5", testDrives: 48, purchases: 18, rate: 38 },
  { month: "T6", testDrives: 59, purchases: 24, rate: 41 },
]

export function TestDriveReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [selectedShowroom, setSelectedShowroom] = useState("all")

  const exportReport = () => {
    // Mock export functionality
    console.log("Exporting report...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Báo cáo lái thử</h2>
          <p className="text-muted-foreground">Phân tích hiệu suất và xu hướng lái thử</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 tháng</SelectItem>
              <SelectItem value="3months">3 tháng</SelectItem>
              <SelectItem value="6months">6 tháng</SelectItem>
              <SelectItem value="1year">1 năm</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedShowroom} onValueChange={setSelectedShowroom}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả showroom</SelectItem>
              <SelectItem value="hcm-q1">Quận 1</SelectItem>
              <SelectItem value="hcm-q7">Quận 7</SelectItem>
              <SelectItem value="hcm-thu-duc">Thủ Đức</SelectItem>
              <SelectItem value="hcm-binh-thanh">Bình Thạnh</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng lái thử</p>
                <p className="text-2xl font-bold">340</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% so với tháng trước
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tỷ lệ hoàn thành</p>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2% so với tháng trước
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tỷ lệ chuyển đổi</p>
                <p className="text-2xl font-bold">36%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +4% so với tháng trước
                </p>
              </div>
              <Car className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Khách hàng mới</p>
                <p className="text-2xl font-bold">284</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% so với tháng trước
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Bookings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng đặt lịch theo tháng</CardTitle>
            <CardDescription>Số lượng đặt lịch và hoàn thành trong 6 tháng qua</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3b82f6" name="Đặt lịch" />
                <Bar dataKey="completed" fill="#10b981" name="Hoàn thành" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố theo dòng xe</CardTitle>
            <CardDescription>Tỷ lệ lái thử theo từng mẫu xe</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {vehicleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Showroom Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất theo showroom</CardTitle>
            <CardDescription>So sánh hiệu suất giữa các showroom</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {showroomData.map((showroom) => (
                <div key={showroom.showroom} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{showroom.showroom}</div>
                    <div className="text-sm text-muted-foreground">
                      {showroom.completed}/{showroom.bookings} hoàn thành
                    </div>
                  </div>
                  <Badge variant="secondary">{showroom.rate}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng tỷ lệ chuyển đổi</CardTitle>
            <CardDescription>Tỷ lệ khách hàng mua xe sau khi lái thử</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2} name="Tỷ lệ chuyển đổi (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
