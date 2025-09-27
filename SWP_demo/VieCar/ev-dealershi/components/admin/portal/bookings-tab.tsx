"use client"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, XCircle, CheckCircle } from "lucide-react"
import { roleDefinitions, testDriveBookings } from "./data"

function canPerformAction(userRole: keyof typeof roleDefinitions, permission: string) {
  const roleConfig = roleDefinitions[userRole]
  return (roleConfig?.permissions as readonly string[]).includes(permission)
}

export function BookingsTab() {
  const selectedRole: keyof typeof roleDefinitions = "dealer_manager"

  const getStatusBadge = (status: string) => {
    const map: Record<string, {label: string, className: string}> = {
      requested: { label: "Yêu cầu", className: "bg-gray-100 text-gray-800" },
      confirmed: { label: "Đã xác nhận", className: "bg-green-100 text-green-800" },
      completed: { label: "Đã hoàn thành", className: "bg-blue-100 text-blue-800" },
      noshow: { label: "Không đến", className: "bg-orange-100 text-orange-800" },
      cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
    }
    const cfg = map[status] || { label: status, className: "" }
    return <Badge className={cfg.className}>{cfg.label}</Badge>
  }

  return (
    <TabsContent value="bookings" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý lịch lái thử</h2>
        <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Export danh sách</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Mã đặt lịch</th>
                  <th className="text-left p-4 font-medium">Khách hàng</th>
                  <th className="text-left p-4 font-medium">Liên hệ</th>
                  <th className="text-left p-4 font-medium">Xe lái thử</th>
                  <th className="text-left p-4 font-medium">Ngày giờ</th>
                  <th className="text-left p-4 font-medium">Showroom</th>
                  <th className="text-left p-4 font-medium">Trạng thái</th>
                  <th className="text-left p-4 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {testDriveBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-mono text-sm">{booking.id}</td>
                    <td className="p-4 font-medium">{booking.customerName}</td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>{booking.phone}</div>
                        <div className="text-muted-foreground">{booking.email}</div>
                      </div>
                    </td>
                    <td className="p-4">{booking.model} {booking.variant}</td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>{booking.date}</div>
                        <div className="text-muted-foreground">{booking.time}</div>
                      </div>
                    </td>
                    <td className="p-4">{booking.showroom}</td>
                    <td className="p-4">{getStatusBadge(booking.status)}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {booking.status === "requested" && canPerformAction(selectedRole, "testdrives.approve") && (
                          <>
                            <Button size="sm" variant="outline"><CheckCircle className="h-4 w-4 text-green-600"/></Button>
                            <Button size="sm" variant="outline"><XCircle className="h-4 w-4 text-red-600"/></Button>
                          </>
                        )}
                        <Button size="sm" variant="outline"><Eye className="h-4 w-4"/></Button>
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
