"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DataTable } from "@/components/ui/data-table"
import { RoleGuard } from "@/components/auth/role-guard"
import { useAuth } from "@/components/auth/auth-provider"
import { Eye, Check, X, Truck, Car, FileText } from "lucide-react"

interface OrderItem {
  id: string
  vehicle: string
  variant: string
  color: string
  vin?: string
  quantity: number
  unitPrice: number
  total: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail: string
  status: "pending" | "approved" | "allocated" | "ready_for_delivery" | "delivered" | "cancelled"
  items: OrderItem[]
  subtotal: number
  taxAmount: number
  totalAmount: number
  depositAmount: number
  remainingAmount: number
  notes: string
  deliveryAddress: string
  expectedDeliveryDate?: Date
  actualDeliveryDate?: Date
  createdBy: string
  approvedBy?: string
  deliveredBy?: string
  cancellationReason?: string
  createdAt: Date
  updatedAt: Date
}

// Mock order data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2025-001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    customerEmail: "nguyenvana@email.com",
    status: "approved",
    items: [
      {
        id: "1",
        vehicle: "VF8",
        variant: "Plus",
        color: "Xanh Ocean",
        quantity: 1,
        unitPrice: 1291000000,
        total: 1291000000,
      },
    ],
    subtotal: 1291000000,
    taxAmount: 129100000,
    totalAmount: 1420100000,
    depositAmount: 200000000,
    remainingAmount: 1220100000,
    notes: "Khách hàng yêu cầu giao xe tại nhà",
    deliveryAddress: "123 Nguyễn Văn Cừ, Quận 1, TP.HCM",
    expectedDeliveryDate: new Date("2025-02-15"),
    createdBy: "Trần Thị Staff",
    approvedBy: "Nguyễn Văn Manager",
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-21"),
  },
  {
    id: "2",
    orderNumber: "ORD-2025-002",
    customerName: "Trần Thị B",
    customerPhone: "0912345678",
    customerEmail: "tranthib@email.com",
    status: "ready_for_delivery",
    items: [
      {
        id: "2",
        vehicle: "VF9",
        variant: "Plus",
        color: "Trắng Pearl",
        vin: "VF9P2025001234569",
        quantity: 1,
        unitPrice: 1491000000,
        total: 1491000000,
      },
    ],
    subtotal: 1491000000,
    taxAmount: 149100000,
    totalAmount: 1640100000,
    depositAmount: 300000000,
    remainingAmount: 1340100000,
    notes: "Xe đã về kho, sẵn sàng giao",
    deliveryAddress: "456 Lê Văn Sỹ, Quận 3, TP.HCM",
    expectedDeliveryDate: new Date("2025-01-25"),
    createdBy: "Trần Thị Staff",
    approvedBy: "Nguyễn Văn Manager",
    createdAt: new Date("2025-01-18"),
    updatedAt: new Date("2025-01-22"),
  },
]

export function OrderManagement() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      allocated: "Đã phân bổ xe",
      ready_for_delivery: "Sẵn sàng giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    }
    return labels[status as keyof typeof labels] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500",
      approved: "bg-blue-500",
      allocated: "bg-purple-500",
      ready_for_delivery: "bg-green-500",
      delivered: "bg-gray-500",
      cancelled: "bg-red-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const handleApproveOrder = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "approved" as const,
              approvedBy: user?.fullName || "Unknown",
              updatedAt: new Date(),
            }
          : order,
      ),
    )
  }

  const handleMarkReadyForDelivery = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "ready_for_delivery" as const,
              updatedAt: new Date(),
            }
          : order,
      ),
    )
  }

  const handleMarkDelivered = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "delivered" as const,
              actualDeliveryDate: new Date(),
              deliveredBy: user?.fullName || "Unknown",
              updatedAt: new Date(),
            }
          : order,
      ),
    )
  }

  const handleCancelOrder = (orderId: string, reason: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "cancelled" as const,
              cancellationReason: reason,
              updatedAt: new Date(),
            }
          : order,
      ),
    )
  }

  const orderColumns = [
    {
      key: "orderNumber" as const,
      label: "Số đơn hàng",
      sortable: true,
    },
    {
      key: "customerName" as const,
      label: "Khách hàng",
      sortable: true,
    },
    {
      key: "customerPhone" as const,
      label: "Điện thoại",
      sortable: true,
    },
    {
      key: "totalAmount" as const,
      label: "Tổng tiền",
      sortable: true,
      render: (value: number) => <span className="font-medium">{(value / 1000000).toFixed(0)}M VND</span>,
    },
    {
      key: "depositAmount" as const,
      label: "Đã cọc",
      sortable: true,
      render: (value: number) => <span className="text-green-600">{(value / 1000000).toFixed(0)}M VND</span>,
    },
    {
      key: "status" as const,
      label: "Trạng thái",
      sortable: true,
      render: (value: string) => (
        <Badge className={`${getStatusColor(value)} text-white`}>{getStatusLabel(value)}</Badge>
      ),
    },
    {
      key: "expectedDeliveryDate" as const,
      label: "Dự kiến giao",
      sortable: true,
      render: (value: Date | undefined) => (value ? value.toLocaleDateString("vi-VN") : "-"),
    },
    {
      key: "createdAt" as const,
      label: "Ngày tạo",
      sortable: true,
      render: (value: Date) => value.toLocaleDateString("vi-VN"),
    },
  ]

  const orderActions = (order: Order) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setSelectedOrder(order)
          setIsDetailDialogOpen(true)
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>
      {order.status === "pending" && (
        <RoleGuard permissions={["orders.approve"]}>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => handleApproveOrder(order.id)}>
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleCancelOrder(order.id, "Không đủ xe")}>
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </RoleGuard>
      )}
      {order.status === "allocated" && (
        <RoleGuard permissions={["orders.ready_for_delivery"]}>
          <Button variant="ghost" size="sm" onClick={() => handleMarkReadyForDelivery(order.id)}>
            <Truck className="h-4 w-4 text-green-600" />
          </Button>
        </RoleGuard>
      )}
      {order.status === "ready_for_delivery" && (
        <RoleGuard permissions={["orders.delivered"]}>
          <Button variant="ghost" size="sm" onClick={() => handleMarkDelivered(order.id)}>
            <Car className="h-4 w-4 text-blue-600" />
          </Button>
        </RoleGuard>
      )}
    </div>
  )

  return (
    <RoleGuard permissions={["orders.read"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
            <p className="text-muted-foreground">Theo dõi và xử lý đơn hàng từ khách hàng</p>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {Object.entries({
            pending: "Chờ duyệt",
            approved: "Đã duyệt",
            allocated: "Đã phân bổ",
            ready_for_delivery: "Sẵn sàng giao",
            delivered: "Đã giao",
            cancelled: "Đã hủy",
          }).map(([status, label]) => {
            const count = orders.filter((o) => o.status === status).length
            return (
              <Card key={status}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{count}</div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Order Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn hàng</CardTitle>
            <CardDescription>Tổng cộng {orders.length} đơn hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={orders}
              columns={orderColumns}
              actions={orderActions}
              searchable={true}
              exportable={true}
              pageSize={10}
            />
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>Chi tiết đơn hàng {selectedOrder?.orderNumber}</DialogTitle>
              <DialogDescription>Thông tin chi tiết và trạng thái đơn hàng</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Status Timeline */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Tiến trình đơn hàng</h4>
                  <div className="flex items-center space-x-4">
                    {[
                      { status: "pending", label: "Chờ duyệt" },
                      { status: "approved", label: "Đã duyệt" },
                      { status: "allocated", label: "Đã phân bổ" },
                      { status: "ready_for_delivery", label: "Sẵn sàng giao" },
                      { status: "delivered", label: "Đã giao" },
                    ].map((step, index) => {
                      const isActive = selectedOrder.status === step.status
                      const isCompleted =
                        ["approved", "allocated", "ready_for_delivery", "delivered"].indexOf(selectedOrder.status) >=
                        ["approved", "allocated", "ready_for_delivery", "delivered"].indexOf(step.status)
                      const isCancelled = selectedOrder.status === "cancelled"

                      return (
                        <div key={step.status} className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              isCancelled
                                ? "bg-red-100 text-red-600"
                                : isActive
                                  ? "bg-blue-500 text-white"
                                  : isCompleted
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="ml-2 text-sm">
                            <p className={isActive ? "font-medium" : ""}>{step.label}</p>
                          </div>
                          {index < 4 && <div className="w-8 h-px bg-gray-300 mx-2" />}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Customer and Order Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Thông tin khách hàng</h4>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">Họ tên</Label>
                        <p className="text-sm">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Điện thoại</Label>
                        <p className="text-sm">{selectedOrder.customerPhone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm">{selectedOrder.customerEmail}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Địa chỉ giao xe</Label>
                        <p className="text-sm">{selectedOrder.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Thông tin đơn hàng</h4>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">Trạng thái</Label>
                        <div className="mt-1">
                          <Badge className={`${getStatusColor(selectedOrder.status)} text-white`}>
                            {getStatusLabel(selectedOrder.status)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Ngày tạo</Label>
                        <p className="text-sm">{selectedOrder.createdAt.toLocaleDateString("vi-VN")}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Tạo bởi</Label>
                        <p className="text-sm">{selectedOrder.createdBy}</p>
                      </div>
                      {selectedOrder.approvedBy && (
                        <div>
                          <Label className="text-sm font-medium">Duyệt bởi</Label>
                          <p className="text-sm">{selectedOrder.approvedBy}</p>
                        </div>
                      )}
                      {selectedOrder.expectedDeliveryDate && (
                        <div>
                          <Label className="text-sm font-medium">Dự kiến giao xe</Label>
                          <p className="text-sm">{selectedOrder.expectedDeliveryDate.toLocaleDateString("vi-VN")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-3">Chi tiết sản phẩm</h4>
                  <div className="border rounded-lg">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3">Sản phẩm</th>
                          <th className="text-center p-3">VIN</th>
                          <th className="text-right p-3">Đơn giá</th>
                          <th className="text-right p-3">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-3">
                              <div>
                                <p className="font-medium">
                                  {item.vehicle} {item.variant}
                                </p>
                                <p className="text-sm text-muted-foreground">Màu: {item.color}</p>
                              </div>
                            </td>
                            <td className="text-center p-3">
                              {item.vin ? (
                                <span className="font-mono text-xs">{item.vin}</span>
                              ) : (
                                <span className="text-muted-foreground">Chưa phân bổ</span>
                              )}
                            </td>
                            <td className="text-right p-3">{(item.unitPrice / 1000000).toFixed(0)}M VND</td>
                            <td className="text-right p-3 font-medium">{(item.total / 1000000).toFixed(0)}M VND</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium mb-3">Thông tin thanh toán</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{(selectedOrder.subtotal / 1000000).toFixed(0)}M VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (10%):</span>
                      <span>{(selectedOrder.taxAmount / 1000000).toFixed(0)}M VND</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Tổng cộng:</span>
                      <span className="text-primary">{(selectedOrder.totalAmount / 1000000).toFixed(0)}M VND</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Đã thanh toán:</span>
                      <span>{(selectedOrder.depositAmount / 1000000).toFixed(0)}M VND</span>
                    </div>
                    <div className="flex justify-between text-orange-600 font-medium">
                      <span>Còn lại:</span>
                      <span>{(selectedOrder.remainingAmount / 1000000).toFixed(0)}M VND</span>
                    </div>
                  </div>
                </div>

                {/* Notes and Actions */}
                {selectedOrder.notes && (
                  <div>
                    <Label className="text-sm font-medium">Ghi chú</Label>
                    <p className="text-sm mt-1">{selectedOrder.notes}</p>
                  </div>
                )}

                {selectedOrder.cancellationReason && (
                  <div>
                    <Label className="text-sm font-medium">Lý do hủy</Label>
                    <p className="text-sm mt-1 text-red-600">{selectedOrder.cancellationReason}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    In hợp đồng
                  </Button>
                  {selectedOrder.status === "ready_for_delivery" && (
                    <Button onClick={() => handleMarkDelivered(selectedOrder.id)}>
                      <Car className="mr-2 h-4 w-4" />
                      Xác nhận giao xe
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}
