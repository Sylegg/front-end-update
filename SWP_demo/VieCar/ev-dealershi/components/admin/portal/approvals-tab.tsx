"use client"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Download, Eye, RefreshCw, XCircle } from "lucide-react"
import { orders, quotes, roleDefinitions } from "./data"
import { formatCurrencyVND } from "./utils"

function canPerformAction(userRole: keyof typeof roleDefinitions, permission: string) {
  const roleConfig = roleDefinitions[userRole]
  return (roleConfig?.permissions as readonly string[]).includes(permission)
}

export function ApprovalsTab() {
  const selectedRole: keyof typeof roleDefinitions = "dealer_manager"

  return (
    <TabsContent value="approvals" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý phê duyệt</h2>
        <div className="flex space-x-2">
          <Button><CheckCircle className="mr-2 h-4 w-4"/>Duyệt hàng loạt</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Báo giá chờ duyệt</CardTitle>
            <CardDescription>{quotes.filter((q) => q.status === "submitted").length} báo giá cần xử lý</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quotes.filter((q) => q.status === "submitted").map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{quote.id} - {quote.customerName}</p>
                    <p className="text-sm text-muted-foreground">{quote.model} {quote.variant} - Chiết khấu {quote.discountPercent}%</p>
                    <p className="text-sm text-muted-foreground">Giá cuối: {formatCurrencyVND(quote.finalPrice)}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {canPerformAction(selectedRole, "quotes.approve") && (
                      <>
                        <Button size="sm" variant="outline"><CheckCircle className="h-4 w-4 text-green-600"/></Button>
                        <Button size="sm" variant="outline"><XCircle className="h-4 w-4 text-red-600"/></Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng chờ xác nhận</CardTitle>
            <CardDescription>{orders.filter((o) => o.status === "draft").length} đơn hàng cần xử lý</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.filter((o) => o.status === "draft").map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{order.id} - {order.customerName}</p>
                    <p className="text-sm text-muted-foreground">{order.model} {order.variant} - {order.color}</p>
                    <p className="text-sm text-muted-foreground">Tổng giá: {formatCurrencyVND(order.totalPrice)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800">{order.status}</Badge>
                    {canPerformAction(selectedRole, "orders.approve") && (
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline"><CheckCircle className="h-4 w-4 text-green-600"/></Button>
                        <Button size="sm" variant="outline"><XCircle className="h-4 w-4 text-red-600"/></Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử phê duyệt</CardTitle>
          <CardDescription>Theo dõi các quyết định phê duyệt gần đây</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Báo giá Q001 đã được duyệt</p>
                  <p className="text-sm text-muted-foreground">Bởi Hoàng Văn E - 2 giờ trước</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Approved</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">Đơn hàng ORD005 bị từ chối</p>
                  <p className="text-sm text-muted-foreground">Bởi Hoàng Văn E - 4 giờ trước</p>
                </div>
              </div>
              <Badge className="bg-red-100 text-red-800">Rejected</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Phân bổ xe AL001 đang chờ EVM</p>
                  <p className="text-sm text-muted-foreground">Gửi yêu cầu - 6 giờ trước</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
