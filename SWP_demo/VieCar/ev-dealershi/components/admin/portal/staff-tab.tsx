"use client"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, Edit, Eye, Mail, Phone, Plus } from "lucide-react"
import { roleDefinitions, salesStaff } from "./data"
import { formatCurrencyVND } from "./utils"

export function StaffTab() {
  return (
    <TabsContent value="staff" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý nhân viên</h2>
        <Button><Plus className="mr-2 h-4 w-4"/>Thêm nhân viên</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Khách hàng tiềm năng</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-sm">Leads mới (tuần)</span><Badge variant="outline">24</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm">Đang theo dõi</span><Badge variant="outline">156</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm">Tỷ lệ chuyển đổi</span><Badge className="bg-green-100 text-green-800">18.5%</Badge></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Hoạt động bán hàng</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-sm">Cuộc gọi hôm nay</span><Badge variant="outline">47</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm">Email gửi đi</span><Badge variant="outline">23</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm">Lịch hẹn đã đặt</span><Badge className="bg-blue-100 text-blue-800">12</Badge></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Hiệu suất team</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-sm">Doanh số tháng</span><Badge className="bg-green-100 text-green-800">2.8B VND</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm">Mục tiêu hoàn thành</span><Badge className="bg-yellow-100 text-yellow-800">76%</Badge></div>
              <div className="flex items-center justify-between"><span className="text-sm">Xe bán ra</span><Badge variant="outline">19/25</Badge></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salesStaff.map((staff) => (
          <Card key={staff.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{staff.name}</CardTitle>
                <Badge variant={staff.status === "active" ? "default" : "secondary"}>{staff.status === "active" ? "Hoạt động" : "Tạm nghỉ"}</Badge>
              </div>
              <CardDescription>{roleDefinitions[staff.role as keyof typeof roleDefinitions]?.name || staff.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2"><Building className="h-4 w-4 text-muted-foreground"/><span className="text-sm">{staff.showroom}</span></div>
                <div className="flex items-center space-x-2"><Mail className="h-4 w-4 text-muted-foreground"/><span className="text-sm text-muted-foreground">{staff.email}</span></div>
                <div className="flex items-center space-x-2"><Phone className="h-4 w-4 text-muted-foreground"/><span className="text-sm text-muted-foreground">{staff.phone}</span></div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm"><span>Leads được giao:</span><span className="font-medium">15</span></div>
                  <div className="flex justify-between text-sm"><span>Tỷ lệ chuyển đổi:</span><span className="font-medium text-green-600">22%</span></div>
                  <div className="flex justify-between text-sm"><span>Doanh số tháng:</span><span className="font-medium">{formatCurrencyVND(staff.currentSales * 1_200_000_000).slice(0, -4)}M</span></div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span>Mục tiêu tháng:</span><span className="font-medium">{staff.currentSales}/{staff.monthlyTarget}</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min((staff.currentSales / staff.monthlyTarget) * 100, 100)}%` }}></div>
                  </div>
                  <div className="text-xs text-muted-foreground">{((staff.currentSales / staff.monthlyTarget) * 100).toFixed(1)}% hoàn thành</div>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent"><Eye className="mr-2 h-4 w-4"/>Xem</Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent"><Edit className="mr-2 h-4 w-4"/>Sửa</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  )
}
