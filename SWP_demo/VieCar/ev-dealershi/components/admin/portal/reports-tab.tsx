"use client"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, DollarSign, Package, TrendingUp, BarChart3 } from "lucide-react"
import { reportingData } from "./data"
import { formatCurrencyVND } from "./utils"

export function ReportsTab() {
  return (
    <TabsContent value="reports" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Báo cáo & Thống kê</h2>
        <div className="flex space-x-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 ngày qua</SelectItem>
              <SelectItem value="month">30 ngày qua</SelectItem>
              <SelectItem value="quarter">3 tháng qua</SelectItem>
              <SelectItem value="year">12 tháng qua</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Export PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">219.6B</div>
            <p className="text-xs text-muted-foreground">+12.5% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Xe đã bán</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">183</div>
            <p className="text-xs text-muted-foreground">+8.2% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ chuyển đổi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.47%</div>
            <p className="text-xs text-muted-foreground">Từ visit thành mua hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trị đơn TB</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2B</div>
            <p className="text-xs text-muted-foreground">VND/đơn hàng</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doanh số theo tháng</CardTitle>
            <CardDescription>Xu hướng bán hàng 4 tháng gần đây</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportingData.salesByMonth.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <span className="font-medium">{item.month}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.sales} xe</div>
                    <div className="text-sm text-muted-foreground">{formatCurrencyVND(item.revenue).slice(0, -4)}M</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Doanh số theo model</CardTitle>
            <CardDescription>Phân bố bán hàng theo từng dòng xe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportingData.salesByModel.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.model}</span>
                    <span>{item.sales} xe ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất showroom</CardTitle>
            <CardDescription>Doanh số theo từng điểm bán</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportingData.salesByShowroom.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium">{item.showroom}</div>
                    <div className="text-sm text-muted-foreground">{item.sales} xe bán ra</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrencyVND(item.revenue).slice(0, -4)}M</div>
                    <div className="text-sm text-muted-foreground">Doanh thu</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Phễu chuyển đổi</CardTitle>
            <CardDescription>Hành trình khách hàng từ visit đến mua hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportingData.conversionFunnel.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.stage}</span>
                    <span>{item.count.toLocaleString()} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-green-500" : idx === 2 ? "bg-yellow-500" : idx === 3 ? "bg-orange-500" : "bg-red-500"}`} style={{ width: `${Math.max(item.percentage * 10, 5)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}
