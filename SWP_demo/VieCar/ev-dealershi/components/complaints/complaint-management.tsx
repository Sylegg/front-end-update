"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { RoleGuard } from "@/components/auth/role-guard"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MessageSquare, AlertTriangle, Clock, CheckCircle, XCircle, User, Phone, Mail } from "lucide-react"

interface Complaint {
  id: string
  ticketNumber: string
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  subject: string
  description: string
  category: "product" | "service" | "delivery" | "warranty" | "billing" | "other"
  priority: "low" | "medium" | "high" | "urgent"
  status: "new" | "in_progress" | "pending_customer" | "resolved" | "closed"
  assignedTo?: string
  assignedToName?: string
  dealerId?: string
  orderId?: string
  vehicleVin?: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  resolution?: string
  satisfactionRating?: number
  followUpRequired: boolean
}

// Mock complaints data
const mockComplaints: Complaint[] = [
  {
    id: "1",
    ticketNumber: "CP-2025-001",
    customerId: "4",
    customerName: "Lê Văn Customer",
    customerPhone: "0934567890",
    customerEmail: "customer@gmail.com",
    subject: "Xe giao chậm so với cam kết",
    description:
      "Đã đặt xe từ tháng 12/2024 nhưng đến nay vẫn chưa được giao xe. Đại lý cam kết giao trong tháng 1 nhưng không thực hiện được.",
    category: "delivery",
    priority: "high",
    status: "in_progress",
    assignedTo: "2",
    assignedToName: "Nguyễn Văn Manager",
    dealerId: "dealer1",
    orderId: "ORD-2024-123",
    vehicleVin: "VF8P2024001234567",
    createdAt: new Date("2025-01-18"),
    updatedAt: new Date("2025-01-20"),
    followUpRequired: true,
  },
  {
    id: "2",
    ticketNumber: "CP-2025-002",
    customerId: "5",
    customerName: "Phạm Thị Hoa",
    customerPhone: "0945678901",
    customerEmail: "hoa.pham@email.com",
    subject: "Lỗi hệ thống infotainment",
    description:
      "Màn hình trung tâm thường xuyên bị đơ, không phản hồi khi chạm. Đã mang đi bảo hành 2 lần nhưng vẫn không khắc phục được.",
    category: "warranty",
    priority: "medium",
    status: "pending_customer",
    assignedTo: "3",
    assignedToName: "Trần Thị Staff",
    dealerId: "dealer1",
    vehicleVin: "VF9P2024001234568",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-19"),
    followUpRequired: true,
  },
  {
    id: "3",
    ticketNumber: "CP-2025-003",
    customerId: "6",
    customerName: "Hoàng Minh Tuấn",
    customerPhone: "0956789012",
    customerEmail: "tuan.hoang@company.com",
    subject: "Thái độ phục vụ không chuyên nghiệp",
    description:
      "Nhân viên tư vấn thiếu nhiệt tình, không giải đáp đầy đủ thắc mắc về sản phẩm. Thời gian chờ đợi quá lâu.",
    category: "service",
    priority: "low",
    status: "resolved",
    assignedTo: "2",
    assignedToName: "Nguyễn Văn Manager",
    dealerId: "dealer1",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-17"),
    resolvedAt: new Date("2025-01-17"),
    resolution: "Đã trao đổi với nhân viên và cải thiện quy trình phục vụ. Khách hàng hài lòng với giải pháp.",
    satisfactionRating: 4,
    followUpRequired: false,
  },
  {
    id: "4",
    ticketNumber: "CP-2025-004",
    customerId: "7",
    customerName: "Nguyễn Thị Lan",
    customerPhone: "0967890123",
    customerEmail: "lan.nguyen@email.com",
    subject: "Sai thông tin trên hóa đơn",
    description: "Hóa đơn VAT có thông tin công ty không chính xác, cần chỉnh sửa để kê khai thuế.",
    category: "billing",
    priority: "medium",
    status: "new",
    dealerId: "dealer1",
    orderId: "ORD-2025-045",
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
    followUpRequired: true,
  },
]

export function ComplaintManagement() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getCategoryLabel = (category: string) => {
    const labels = {
      product: "Sản phẩm",
      service: "Dịch vụ",
      delivery: "Giao hàng",
      warranty: "Bảo hành",
      billing: "Thanh toán",
      other: "Khác",
    }
    return labels[category as keyof typeof labels] || category
  }

  const getPriorityLabel = (priority: string) => {
    const labels = {
      low: "Thấp",
      medium: "Trung bình",
      high: "Cao",
      urgent: "Khẩn cấp",
    }
    return labels[priority as keyof typeof labels] || priority
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      new: "Mới",
      in_progress: "Đang xử lý",
      pending_customer: "Chờ khách hàng",
      resolved: "Đã giải quyết",
      closed: "Đã đóng",
    }
    return labels[status as keyof typeof labels] || status
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-orange-500",
      urgent: "bg-red-500",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-500"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-blue-500",
      in_progress: "bg-purple-500",
      pending_customer: "bg-yellow-500",
      resolved: "bg-green-500",
      closed: "bg-gray-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const complaintColumns = [
    {
      key: "ticketNumber" as const,
      label: "Mã phiếu",
      sortable: true,
      render: (value: string) => <span className="font-mono text-sm font-medium">{value}</span>,
    },
    {
      key: "customerName" as const,
      label: "Khách hàng",
      sortable: true,
    },
    {
      key: "subject" as const,
      label: "Tiêu đề",
      sortable: true,
      render: (value: string) => <span className="max-w-xs truncate">{value}</span>,
    },
    {
      key: "category" as const,
      label: "Danh mục",
      sortable: true,
      render: (value: string) => <Badge variant="outline">{getCategoryLabel(value)}</Badge>,
    },
    {
      key: "priority" as const,
      label: "Độ ưu tiên",
      sortable: true,
      render: (value: string) => (
        <Badge className={`${getPriorityColor(value)} text-white`}>{getPriorityLabel(value)}</Badge>
      ),
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
      key: "assignedToName" as const,
      label: "Phụ trách",
      render: (value: string) => value || "Chưa phân công",
    },
    {
      key: "createdAt" as const,
      label: "Ngày tạo",
      sortable: true,
      render: (value: Date) => value.toLocaleDateString("vi-VN"),
    },
  ]

  const complaintActions = (complaint: Complaint) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setSelectedComplaint(complaint)
          setIsDetailDialogOpen(true)
        }}
      >
        Chi tiết
      </Button>
      <RoleGuard permissions={["complaints.update"]}>
        <Button variant="ghost" size="sm">
          Cập nhật
        </Button>
      </RoleGuard>
    </div>
  )

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    if (filterStatus !== "all" && complaint.status !== filterStatus) return false
    if (filterCategory !== "all" && complaint.category !== filterCategory) return false
    if (filterPriority !== "all" && complaint.priority !== filterPriority) return false
    return true
  })

  // Calculate stats
  const complaintStats = {
    total: complaints.length,
    new: complaints.filter((c) => c.status === "new").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    urgent: complaints.filter((c) => c.priority === "urgent").length,
  }

  return (
    <RoleGuard permissions={["complaints.read"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Quản lý khiếu nại</h2>
            <p className="text-muted-foreground">Theo dõi và xử lý khiếu nại từ khách hàng</p>
          </div>
          <RoleGuard permissions={["complaints.create"]}>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Tạo khiếu nại
            </Button>
          </RoleGuard>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng khiếu nại</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complaintStats.total}</div>
              <p className="text-xs text-muted-foreground">Tất cả khiếu nại</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mới</CardTitle>
              <AlertTriangle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{complaintStats.new}</div>
              <p className="text-xs text-muted-foreground">Chưa xử lý</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{complaintStats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Đang giải quyết</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã giải quyết</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{complaintStats.resolved}</div>
              <p className="text-xs text-muted-foreground">Hoàn thành</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khẩn cấp</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{complaintStats.urgent}</div>
              <p className="text-xs text-muted-foreground">Cần xử lý ngay</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Bộ lọc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="new">Mới</SelectItem>
                    <SelectItem value="in_progress">Đang xử lý</SelectItem>
                    <SelectItem value="pending_customer">Chờ khách hàng</SelectItem>
                    <SelectItem value="resolved">Đã giải quyết</SelectItem>
                    <SelectItem value="closed">Đã đóng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Danh mục</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="product">Sản phẩm</SelectItem>
                    <SelectItem value="service">Dịch vụ</SelectItem>
                    <SelectItem value="delivery">Giao hàng</SelectItem>
                    <SelectItem value="warranty">Bảo hành</SelectItem>
                    <SelectItem value="billing">Thanh toán</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Độ ưu tiên</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tìm kiếm</Label>
                <Input placeholder="Tìm theo mã phiếu, khách hàng..." />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách khiếu nại</CardTitle>
            <CardDescription>
              Hiển thị {filteredComplaints.length} / {complaints.length} khiếu nại
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredComplaints}
              columns={complaintColumns}
              actions={complaintActions}
              searchable={true}
              exportable={true}
              pageSize={15}
            />
          </CardContent>
        </Card>

        {/* Complaint Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết khiếu nại {selectedComplaint?.ticketNumber}</DialogTitle>
              <DialogDescription>Thông tin chi tiết và lịch sử xử lý khiếu nại</DialogDescription>
            </DialogHeader>
            {selectedComplaint && (
              <div className="space-y-6">
                {/* Customer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Thông tin khách hàng</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Họ tên</Label>
                      <p className="font-medium">{selectedComplaint.customerName}</p>
                    </div>
                    <div>
                      <Label>Số điện thoại</Label>
                      <p className="font-medium flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {selectedComplaint.customerPhone}
                      </p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="font-medium flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {selectedComplaint.customerEmail}
                      </p>
                    </div>
                    <div>
                      <Label>Mã đơn hàng</Label>
                      <p className="font-medium">{selectedComplaint.orderId || "Không có"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Complaint Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Chi tiết khiếu nại</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Danh mục</Label>
                        <Badge variant="outline">{getCategoryLabel(selectedComplaint.category)}</Badge>
                      </div>
                      <div>
                        <Label>Độ ưu tiên</Label>
                        <Badge className={`${getPriorityColor(selectedComplaint.priority)} text-white`}>
                          {getPriorityLabel(selectedComplaint.priority)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label>Tiêu đề</Label>
                      <p className="font-medium">{selectedComplaint.subject}</p>
                    </div>
                    <div>
                      <Label>Mô tả chi tiết</Label>
                      <p className="text-sm leading-relaxed">{selectedComplaint.description}</p>
                    </div>
                    {selectedComplaint.resolution && (
                      <div>
                        <Label>Giải pháp</Label>
                        <p className="text-sm leading-relaxed bg-green-50 p-3 rounded-lg">
                          {selectedComplaint.resolution}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Status and Assignment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Trạng thái xử lý</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Trạng thái hiện tại</Label>
                      <Badge className={`${getStatusColor(selectedComplaint.status)} text-white`}>
                        {getStatusLabel(selectedComplaint.status)}
                      </Badge>
                    </div>
                    <div>
                      <Label>Người phụ trách</Label>
                      <p className="font-medium">{selectedComplaint.assignedToName || "Chưa phân công"}</p>
                    </div>
                    <div>
                      <Label>Ngày tạo</Label>
                      <p>{selectedComplaint.createdAt.toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div>
                      <Label>Cập nhật lần cuối</Label>
                      <p>{selectedComplaint.updatedAt.toLocaleDateString("vi-VN")}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}
