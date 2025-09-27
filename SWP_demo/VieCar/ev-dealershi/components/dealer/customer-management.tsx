"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { UserPlus, Phone, Mail, MessageSquare, Calendar, FileText, Eye } from "lucide-react"

interface Customer {
  id: string
  fullName: string
  phone: string
  email: string
  status: "new" | "contacted" | "interested" | "negotiating" | "converted" | "lost"
  source: string
  interestedModel: string
  assignedTo: string
  lastContact: Date
  notes: string
  createdAt: Date
}

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: "1",
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@email.com",
    status: "interested",
    source: "Website",
    interestedModel: "VF8",
    assignedTo: "Trần Thị Staff",
    lastContact: new Date("2025-01-20"),
    notes: "Quan tâm VF8 màu xanh, có nhu cầu mua trong tháng 2",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    fullName: "Trần Thị B",
    phone: "0912345678",
    email: "tranthib@email.com",
    status: "negotiating",
    source: "Referral",
    interestedModel: "VF9",
    assignedTo: "Trần Thị Staff",
    lastContact: new Date("2025-01-19"),
    notes: "Đã lái thử, đang thương lượng giá và phụ kiện",
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "3",
    fullName: "Lê Văn C",
    phone: "0923456789",
    email: "levanc@email.com",
    status: "new",
    source: "Facebook",
    interestedModel: "VF6",
    assignedTo: "Trần Thị Staff",
    lastContact: new Date("2025-01-20"),
    notes: "Khách hàng mới, chưa liên hệ",
    createdAt: new Date("2025-01-20"),
  },
]

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    fullName: "",
    phone: "",
    email: "",
    source: "",
    interestedModel: "",
    notes: "",
  })

  const getStatusLabel = (status: string) => {
    const labels = {
      new: "Mới",
      contacted: "Đã liên hệ",
      interested: "Quan tâm",
      negotiating: "Đang thương lượng",
      converted: "Đã chuyển đổi",
      lost: "Mất khách",
    }
    return labels[status as keyof typeof labels] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-blue-500",
      contacted: "bg-yellow-500",
      interested: "bg-green-500",
      negotiating: "bg-orange-500",
      converted: "bg-purple-500",
      lost: "bg-red-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const handleCreateCustomer = () => {
    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      status: "new",
      assignedTo: "Trần Thị Staff", // Current user
      lastContact: new Date(),
      createdAt: new Date(),
    }
    setCustomers([...customers, customer])
    setIsCreateDialogOpen(false)
    setNewCustomer({
      fullName: "",
      phone: "",
      email: "",
      source: "",
      interestedModel: "",
      notes: "",
    })
  }

  const handleUpdateCustomerStatus = (customerId: string, newStatus: string) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === customerId
          ? { ...customer, status: newStatus as Customer["status"], lastContact: new Date() }
          : customer,
      ),
    )
  }

  const customerColumns = [
    {
      key: "fullName" as const,
      label: "Họ tên",
      sortable: true,
    },
    {
      key: "phone" as const,
      label: "Điện thoại",
      sortable: true,
    },
    {
      key: "email" as const,
      label: "Email",
      sortable: true,
    },
    {
      key: "interestedModel" as const,
      label: "Xe quan tâm",
      sortable: true,
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
      key: "source" as const,
      label: "Nguồn",
      sortable: true,
    },
    {
      key: "lastContact" as const,
      label: "Liên hệ cuối",
      sortable: true,
      render: (value: Date) => value.toLocaleDateString("vi-VN"),
    },
  ]

  const customerActions = (customer: Customer) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setSelectedCustomer(customer)
          setIsDetailDialogOpen(true)
        }}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Phone className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Mail className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Calendar className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý khách hàng</h2>
          <p className="text-muted-foreground">Theo dõi và chăm sóc khách hàng tiềm năng</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm khách hàng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm khách hàng mới</DialogTitle>
              <DialogDescription>Nhập thông tin khách hàng tiềm năng</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ tên *</Label>
                  <Input
                    id="fullName"
                    value={newCustomer.fullName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Điện thoại *</Label>
                  <Input
                    id="phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Nguồn khách hàng</Label>
                  <Select
                    value={newCustomer.source}
                    onValueChange={(value) => setNewCustomer({ ...newCustomer, source: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nguồn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="Referral">Giới thiệu</SelectItem>
                      <SelectItem value="Showroom">Showroom</SelectItem>
                      <SelectItem value="Event">Sự kiện</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestedModel">Xe quan tâm</Label>
                  <Select
                    value={newCustomer.interestedModel}
                    onValueChange={(value) => setNewCustomer({ ...newCustomer, interestedModel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mẫu xe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VF6">VF6</SelectItem>
                      <SelectItem value="VF7">VF7</SelectItem>
                      <SelectItem value="VF8">VF8</SelectItem>
                      <SelectItem value="VF9">VF9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  placeholder="Thông tin bổ sung về khách hàng..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateCustomer}>
                Thêm khách hàng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {Object.entries({
          new: "Mới",
          contacted: "Đã liên hệ",
          interested: "Quan tâm",
          negotiating: "Thương lượng",
          converted: "Chuyển đổi",
          lost: "Mất khách",
        }).map(([status, label]) => {
          const count = customers.filter((c) => c.status === status).length
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

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
          <CardDescription>Tổng cộng {customers.length} khách hàng</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={customers}
            columns={customerColumns}
            actions={customerActions}
            searchable={true}
            exportable={true}
            pageSize={10}
            onRowClick={(customer) => {
              setSelectedCustomer(customer)
              setIsDetailDialogOpen(true)
            }}
          />
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi tiết khách hàng</DialogTitle>
            <DialogDescription>Thông tin và lịch sử tương tác với {selectedCustomer?.fullName}</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Họ tên</Label>
                  <p className="text-sm">{selectedCustomer.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Điện thoại</Label>
                  <p className="text-sm">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedCustomer.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Xe quan tâm</Label>
                  <p className="text-sm">{selectedCustomer.interestedModel}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Trạng thái</Label>
                  <div className="mt-1">
                    <Select
                      value={selectedCustomer.status}
                      onValueChange={(value) => handleUpdateCustomerStatus(selectedCustomer.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Mới</SelectItem>
                        <SelectItem value="contacted">Đã liên hệ</SelectItem>
                        <SelectItem value="interested">Quan tâm</SelectItem>
                        <SelectItem value="negotiating">Đang thương lượng</SelectItem>
                        <SelectItem value="converted">Đã chuyển đổi</SelectItem>
                        <SelectItem value="lost">Mất khách</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nguồn</Label>
                  <p className="text-sm">{selectedCustomer.source}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Ghi chú</Label>
                <p className="text-sm mt-1">{selectedCustomer.notes}</p>
              </div>

              <div className="flex space-x-2">
                <Button size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  Gọi điện
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Gửi email
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Gửi SMS
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Đặt lịch
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Tạo báo giá
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
