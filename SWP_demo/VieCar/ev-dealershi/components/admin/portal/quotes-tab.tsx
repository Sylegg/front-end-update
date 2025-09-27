"use client"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Edit, Eye, Plus, XCircle, CheckCircle } from "lucide-react"
import { quotes, roleDefinitions } from "./data"
import { formatCurrencyVND } from "./utils"

function canPerformAction(userRole: keyof typeof roleDefinitions, permission: string) {
  const roleConfig = roleDefinitions[userRole]
  return (roleConfig?.permissions as readonly string[]).includes(permission)
}

export function QuotesTab() {
  const selectedRole: keyof typeof roleDefinitions = "dealer_manager"

  const getStatusBadge = (status: string) => {
    const map: Record<string, {label: string, className: string}> = {
      draft: { label: "Nháp", className: "bg-gray-100 text-gray-800" },
      submitted: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Đã duyệt", className: "bg-green-100 text-green-800" },
      rejected: { label: "Từ chối", className: "bg-red-100 text-red-800" },
      expired: { label: "Hết hạn", className: "bg-gray-100 text-gray-800" },
      converted: { label: "Đã chuyển đổi", className: "bg-purple-100 text-purple-800" },
    }
    const cfg = map[status] || { label: status, className: "" }
    return <Badge className={cfg.className}>{cfg.label}</Badge>
  }

  return (
    <TabsContent value="quotes" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý báo giá</h2>
        <div className="flex space-x-2">
          <Button><Plus className="mr-2 h-4 w-4"/>Tạo báo giá mới</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Export</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Mã báo giá</th>
                  <th className="text-left p-4 font-medium">Khách hàng</th>
                  <th className="text-left p-4 font-medium">Xe</th>
                  <th className="text-left p-4 font-medium">Tổng giá</th>
                  <th className="text-left p-4 font-medium">Nhân viên</th>
                  <th className="text-left p-4 font-medium">Trạng thái</th>
                  <th className="text-left p-4 font-medium">Hết hạn</th>
                  <th className="text-left p-4 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-mono text-sm">{quote.id}</td>
                    <td className="p-4">
                      <div className="font-medium">{quote.customerName}</div>
                      <div className="text-sm text-muted-foreground">{quote.phone}</div>
                    </td>
                    <td className="p-4">
                      <div>{quote.model} {quote.variant}</div>
                      <div className="text-sm text-muted-foreground">{quote.color}</div>
                    </td>
                    <td className="p-4 font-medium">{formatCurrencyVND(quote.finalPrice).slice(0, -4)}M</td>
                    <td className="p-4">{quote.createdBy}</td>
                    <td className="p-4">{getStatusBadge(quote.status)}</td>
                    <td className="p-4">{quote.validUntil}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {quote.status === "submitted" && canPerformAction(selectedRole, "quotes.approve") && (
                          <>
                            <Button size="sm" variant="outline"><CheckCircle className="h-4 w-4 text-green-600"/></Button>
                            <Button size="sm" variant="outline"><XCircle className="h-4 w-4 text-red-600"/></Button>
                          </>
                        )}
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
