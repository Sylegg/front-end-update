"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DataTable } from "@/components/ui/data-table"
import { RoleGuard } from "@/components/auth/role-guard"
import { useAuth } from "@/components/auth/auth-provider"
import { FileText, Plus, Eye, Check, X, Send, Download } from "lucide-react"

interface QuoteItem {
  id: string
  vehicle: string
  variant: string
  color: string
  quantity: number
  unitPrice: number
  discount: number
  total: number
}

interface Quote {
  id: string
  quoteNumber: string
  customerName: string
  customerPhone: string
  customerEmail: string
  status: "draft" | "submitted" | "approved" | "rejected" | "expired" | "converted"
  items: QuoteItem[]
  subtotal: number
  discountAmount: number
  taxAmount: number
  totalAmount: number
  validUntil: Date
  notes: string
  createdBy: string
  approvedBy?: string
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

// Mock quote data
const mockQuotes: Quote[] = [
  {
    id: "1",
    quoteNumber: "QT-2025-001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    customerEmail: "nguyenvana@email.com",
    status: "submitted",
    items: [
      {
        id: "1",
        vehicle: "VF8",
        variant: "Plus",
        color: "Xanh Ocean",
        quantity: 1,
        unitPrice: 1291000000,
        discount: 8,
        total: 1187720000,
      },
    ],
    subtotal: 1291000000,
    discountAmount: 103280000,
    taxAmount: 118772000,
    totalAmount: 1306492000,
    validUntil: new Date("2025-02-20"),
    notes: "Khách hàng quan tâm gói phụ kiện cao cấp",
    createdBy: "Trần Thị Staff",
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
  },
  {
    id: "2",
    quoteNumber: "QT-2025-002",
    customerName: "Trần Thị B",
    customerPhone: "0912345678",
    customerEmail: "tranthib@email.com",
    status: "approved",
    items: [
      {
        id: "2",
        vehicle: "VF9",
        variant: "Plus",
        color: "Trắng Pearl",
        quantity: 1,
        unitPrice: 1491000000,
        discount: 5,
        total: 1416450000,
      },
    ],
    subtotal: 1491000000,
    discountAmount: 74550000,
    taxAmount: 141645000,
    totalAmount: 1558095000,
    validUntil: new Date("2025-02-25"),
    notes: "Đã lái thử, khách hàng rất hài lòng",
    createdBy: "Trần Thị Staff",
    approvedBy: "Nguyễn Văn Manager",
    createdAt: new Date("2025-01-18"),
    updatedAt: new Date("2025-01-19"),
  },
]

export function QuoteManagement() {
  const { user } = useAuth()
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [newQuote, setNewQuote] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    vehicle: "",
    variant: "",
    color: "",
    notes: "",
  })

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: "Nháp",
      submitted: "Chờ duyệt",
      approved: "Đã duyệt",
      rejected: "Từ chối",
      expired: "Hết hạn",
      converted: "Đã chuyển đổi",
    }
    return labels[status as keyof typeof labels] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-500",
      submitted: "bg-yellow-500",
      approved: "bg-green-500",
      rejected: "bg-red-500",
      expired: "bg-orange-500",
      converted: "bg-blue-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const handleCreateQuote = () => {
    const quote: Quote = {
      id: Date.now().toString(),
      quoteNumber: `QT-${new Date().getFullYear()}-${String(quotes.length + 1).padStart(3, "0")}`,
      ...newQuote,
      status: "draft",
      items: [
        {
          id: "1",
          vehicle: newQuote.vehicle,
          variant: newQuote.variant,
          color: newQuote.color,
          quantity: 1,
          unitPrice: 1291000000, // Mock price
          discount: 0,
          total: 1291000000,
        },
      ],
      subtotal: 1291000000,
      discountAmount: 0,
      taxAmount: 129100000,
      totalAmount: 1420100000,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdBy: user?.fullName || "Unknown",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setQuotes([...quotes, quote])
    setIsCreateDialogOpen(false)
    setNewQuote({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      vehicle: "",
      variant: "",
      color: "",
      notes: "",
    })
  }

  const handleApproveQuote = (quoteId: string) => {
    setQuotes(
      quotes.map((quote) =>
        quote.id === quoteId
          ? {
              ...quote,
              status: "approved" as const,
              approvedBy: user?.fullName || "Unknown",
              updatedAt: new Date(),
            }
          : quote,
      ),
    )
  }

  const handleRejectQuote = (quoteId: string, reason: string) => {
    setQuotes(
      quotes.map((quote) =>
        quote.id === quoteId
          ? {
              ...quote,
              status: "rejected" as const,
              rejectionReason: reason,
              updatedAt: new Date(),
            }
          : quote,
      ),
    )
  }

  const handleSubmitQuote = (quoteId: string) => {
    setQuotes(
      quotes.map((quote) =>
        quote.id === quoteId
          ? {
              ...quote,
              status: "submitted" as const,
              updatedAt: new Date(),
            }
          : quote,
      ),
    )
  }

  const quoteColumns = [
    {
      key: "quoteNumber" as const,
      label: "Số báo giá",
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
      key: "status" as const,
      label: "Trạng thái",
      sortable: true,
      render: (value: string) => (
        <Badge className={`${getStatusColor(value)} text-white`}>{getStatusLabel(value)}</Badge>
      ),
    },
    {
      key: "validUntil" as const,
      label: "Hết hạn",
      sortable: true,
      render: (value: Date) => value.toLocaleDateString("vi-VN"),
    },
    {
      key: "createdBy" as const,
      label: "Tạo bởi",
      sortable: true,
    },
    {
      key: "createdAt" as const,
      label: "Ngày tạo",
      sortable: true,
      render: (value: Date) => value.toLocaleDateString("vi-VN"),
    },
  ]

  const quoteActions = (quote: Quote) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setSelectedQuote(quote)
          setIsDetailDialogOpen(true)
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>
      {quote.status === "draft" && (
        <RoleGuard permissions={["quotes.submit"]}>
          <Button variant="ghost" size="sm" onClick={() => handleSubmitQuote(quote.id)}>
            <Send className="h-4 w-4" />
          </Button>
        </RoleGuard>
      )}
      {quote.status === "submitted" && (
        <RoleGuard permissions={["quotes.approve"]}>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => handleApproveQuote(quote.id)}>
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleRejectQuote(quote.id, "Cần điều chỉnh giá")}>
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </RoleGuard>
      )}
      <Button variant="ghost" size="sm">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <RoleGuard permissions={["quotes.read"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Quản lý báo giá</h2>
            <p className="text-muted-foreground">Tạo và theo dõi báo giá cho khách hàng</p>
          </div>

          <RoleGuard permissions={["quotes.create"]}>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo báo giá
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Tạo báo giá mới</DialogTitle>
                  <DialogDescription>Nhập thông tin để tạo báo giá cho khách hàng</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Tên khách hàng *</Label>
                      <Input
                        id="customerName"
                        value={newQuote.customerName}
                        onChange={(e) => setNewQuote({ ...newQuote, customerName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Điện thoại *</Label>
                      <Input
                        id="customerPhone"
                        value={newQuote.customerPhone}
                        onChange={(e) => setNewQuote({ ...newQuote, customerPhone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={newQuote.customerEmail}
                      onChange={(e) => setNewQuote({ ...newQuote, customerEmail: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicle">Mẫu xe *</Label>
                      <Select
                        value={newQuote.vehicle}
                        onValueChange={(value) => setNewQuote({ ...newQuote, vehicle: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn xe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VF6">VF6</SelectItem>
                          <SelectItem value="VF7">VF7</SelectItem>
                          <SelectItem value="VF8">VF8</SelectItem>
                          <SelectItem value="VF9">VF9</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variant">Phiên bản *</Label>
                      <Select
                        value={newQuote.variant}
                        onValueChange={(value) => setNewQuote({ ...newQuote, variant: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phiên bản" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Eco">Eco</SelectItem>
                          <SelectItem value="Plus">Plus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Màu sắc *</Label>
                      <Select
                        value={newQuote.color}
                        onValueChange={(value) => setNewQuote({ ...newQuote, color: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn màu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Xanh Ocean">Xanh Ocean</SelectItem>
                          <SelectItem value="Trắng Pearl">Trắng Pearl</SelectItem>
                          <SelectItem value="Đen Obsidian">Đen Obsidian</SelectItem>
                          <SelectItem value="Đỏ Ruby">Đỏ Ruby</SelectItem>
                          <SelectItem value="Xám Titanium">Xám Titanium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú</Label>
                    <Textarea
                      id="notes"
                      value={newQuote.notes}
                      onChange={(e) => setNewQuote({ ...newQuote, notes: e.target.value })}
                      placeholder="Thông tin bổ sung về báo giá..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateQuote}>
                    Tạo báo giá
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </RoleGuard>
        </div>

        {/* Quote Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {Object.entries({
            draft: "Nháp",
            submitted: "Chờ duyệt",
            approved: "Đã duyệt",
            rejected: "Từ chối",
            expired: "Hết hạn",
            converted: "Đã chuyển đổi",
          }).map(([status, label]) => {
            const count = quotes.filter((q) => q.status === status).length
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

        {/* Quote Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách báo giá</CardTitle>
            <CardDescription>Tổng cộng {quotes.length} báo giá</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={quotes}
              columns={quoteColumns}
              actions={quoteActions}
              searchable={true}
              exportable={true}
              pageSize={10}
            />
          </CardContent>
        </Card>

        {/* Quote Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Chi tiết báo giá {selectedQuote?.quoteNumber}</DialogTitle>
              <DialogDescription>Thông tin chi tiết và các mục trong báo giá</DialogDescription>
            </DialogHeader>
            {selectedQuote && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Khách hàng</Label>
                    <p className="text-sm">{selectedQuote.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Điện thoại</Label>
                    <p className="text-sm">{selectedQuote.customerPhone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{selectedQuote.customerEmail}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Trạng thái</Label>
                    <Badge className={`${getStatusColor(selectedQuote.status)} text-white`}>
                      {getStatusLabel(selectedQuote.status)}
                    </Badge>
                  </div>
                </div>

                {/* Quote Items */}
                <div>
                  <Label className="text-sm font-medium">Chi tiết sản phẩm</Label>
                  <div className="mt-2 border rounded-lg">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3">Sản phẩm</th>
                          <th className="text-right p-3">Đơn giá</th>
                          <th className="text-right p-3">Chiết khấu</th>
                          <th className="text-right p-3">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedQuote.items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-3">
                              <div>
                                <p className="font-medium">
                                  {item.vehicle} {item.variant}
                                </p>
                                <p className="text-sm text-muted-foreground">Màu: {item.color}</p>
                              </div>
                            </td>
                            <td className="text-right p-3">{(item.unitPrice / 1000000).toFixed(0)}M VND</td>
                            <td className="text-right p-3">{item.discount}%</td>
                            <td className="text-right p-3 font-medium">{(item.total / 1000000).toFixed(0)}M VND</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quote Summary */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{(selectedQuote.subtotal / 1000000).toFixed(0)}M VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chiết khấu:</span>
                      <span className="text-red-600">-{(selectedQuote.discountAmount / 1000000).toFixed(0)}M VND</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (10%):</span>
                      <span>{(selectedQuote.taxAmount / 1000000).toFixed(0)}M VND</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Tổng cộng:</span>
                      <span className="text-primary">{(selectedQuote.totalAmount / 1000000).toFixed(0)}M VND</span>
                    </div>
                  </div>
                </div>

                {/* Notes and Actions */}
                {selectedQuote.notes && (
                  <div>
                    <Label className="text-sm font-medium">Ghi chú</Label>
                    <p className="text-sm mt-1">{selectedQuote.notes}</p>
                  </div>
                )}

                {selectedQuote.rejectionReason && (
                  <div>
                    <Label className="text-sm font-medium">Lý do từ chối</Label>
                    <p className="text-sm mt-1 text-red-600">{selectedQuote.rejectionReason}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    <p>Tạo bởi: {selectedQuote.createdBy}</p>
                    <p>Ngày tạo: {selectedQuote.createdAt.toLocaleDateString("vi-VN")}</p>
                    <p>Có hiệu lực đến: {selectedQuote.validUntil.toLocaleDateString("vi-VN")}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Xuất PDF
                    </Button>
                    {selectedQuote.status === "approved" && (
                      <RoleGuard permissions={["orders.create"]}>
                        <Button>
                          <FileText className="mr-2 h-4 w-4" />
                          Tạo đơn hàng
                        </Button>
                      </RoleGuard>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}
