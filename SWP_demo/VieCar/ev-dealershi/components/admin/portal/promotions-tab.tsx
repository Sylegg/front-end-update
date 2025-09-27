"use client"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Edit, Eye, Gift, Percent, Plus, Target, TrendingUp, Trash2 } from "lucide-react"
import { promotions } from "./data"
import { formatCurrencyVND } from "./utils"

export function PromotionsTab() {
  const statusMap: Record<string, {label: string, className: string}> = {
    active: { label: "Đang hoạt động", className: "bg-green-100 text-green-800" },
    inactive: { label: "Tạm dừng", className: "bg-gray-100 text-gray-800" },
    expired: { label: "Hết hạn", className: "bg-red-100 text-red-800" },
    scheduled: { label: "Đã lên lịch", className: "bg-blue-100 text-blue-800" },
  }

  return (
    <TabsContent value="promotions" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý khuyến mãi</h2>
        <div className="flex space-x-2">
          <Button><Plus className="mr-2 h-4 w-4"/>Tạo khuyến mãi mới</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khuyến mãi đang chạy</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.filter((p) => p.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Tổng cộng {promotions.length} chương trình</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt sử dụng tháng</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.reduce((sum, p) => sum + p.usageCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Tăng 23% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiết kiệm cho khách</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2B</div>
            <p className="text-xs text-muted-foreground">VND tiết kiệm tháng này</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ chuyển đổi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5%</div>
            <p className="text-xs text-muted-foreground">Từ khuyến mãi thành đơn hàng</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Tên chương trình</th>
                  <th className="text-left p-4 font-medium">Loại ưu đãi</th>
                  <th className="text-left p-4 font-medium">Giá trị</th>
                  <th className="text-left p-4 font-medium">Thời gian</th>
                  <th className="text-left p-4 font-medium">Sử dụng</th>
                  <th className="text-left p-4 font-medium">Trạng thái</th>
                  <th className="text-left p-4 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr key={promo.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{promo.name}</div>
                        <div className="text-sm text-muted-foreground">{promo.description}</div>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant="outline">{promo.discountType === "fixed" ? "Giảm cố định" : promo.discountType === "percentage" ? "Giảm %" : "Tặng quà"}</Badge></td>
                    <td className="p-4 font-medium">{promo.discountType === "percentage" ? `${promo.discountValue}%` : formatCurrencyVND(promo.discountValue).slice(0, -4) + "M"}</td>
                    <td className="p-4"><div className="text-sm"><div>{promo.startDate}</div><div className="text-muted-foreground">đến {promo.endDate}</div></div></td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium">{promo.usageCount}/{promo.maxUsage}</div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div className="bg-primary h-1 rounded-full" style={{ width: `${(promo.usageCount / promo.maxUsage) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><Badge className={statusMap[promo.status]?.className}>{statusMap[promo.status]?.label || promo.status}</Badge></td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline"><Eye className="h-4 w-4"/></Button>
                        <Button size="sm" variant="outline"><Edit className="h-4 w-4"/></Button>
                        <Button size="sm" variant="outline"><Trash2 className="h-4 w-4"/></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
