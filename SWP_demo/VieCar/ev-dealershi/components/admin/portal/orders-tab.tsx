"use client"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Edit, Eye } from "lucide-react"
import { orders } from "./data"
import { formatCurrencyVND } from "./utils"

const statusMap: Record<string, {label: string, className: string}> = {
  draft: { label: "Nháp", className: "bg-gray-100 text-gray-800" },
  confirmed: { label: "Đã xác nhận", className: "bg-blue-100 text-blue-800" },
  production: { label: "Đang sản xuất", className: "bg-orange-100 text-orange-800" },
  ready: { label: "Sẵn sàng giao", className: "bg-green-100 text-green-800" },
  delivered: { label: "Đã giao", className: "bg-purple-100 text-purple-800" },
  cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
}

export function OrdersTab() {
  return (
    <TabsContent value="orders" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
        <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Export đơn hàng</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Mã đơn hàng</th>
                  <th className="text-left p-4 font-medium">Khách hàng</th>
                  <th className="text-left p-4 font-medium">Xe</th>
                  <th className="text-left p-4 font-medium">Tổng giá</th>
                  <th className="text-left p-4 font-medium">Đã cọc</th>
                  <th className="text-left p-4 font-medium">Còn lại</th>
                  <th className="text-left p-4 font-medium">Trạng thái</th>
                  <th className="text-left p-4 font-medium">Giao xe</th>
                  <th className="text-left p-4 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-mono text-sm">{order.id}</td>
                    <td className="p-4">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">{order.phone}</div>
                    </td>
                    <td className="p-4">
                      <div>{order.model} {order.variant}</div>
                      <div className="text-sm text-muted-foreground">{order.color}</div>
                    </td>
                    <td className="p-4 font-medium">{formatCurrencyVND(order.totalPrice).slice(0, -4)}M</td>
                    <td className="p-4 text-green-600 font-medium">{formatCurrencyVND(order.depositPaid).slice(0, -4)}M</td>
                    <td className="p-4 font-medium">{formatCurrencyVND(order.remainingAmount).slice(0, -4)}M</td>
                    <td className="p-4"><Badge className={statusMap[order.status]?.className}>{statusMap[order.status]?.label || order.status}</Badge></td>
                    <td className="p-4">{order.expectedDelivery}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline"><Eye className="h-4 w-4"/></Button>
                        <Button size="sm" variant="outline"><Edit className="h-4 w-4"/></Button>
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
