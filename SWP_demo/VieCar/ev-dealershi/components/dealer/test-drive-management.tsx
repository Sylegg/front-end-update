"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Clock, CheckCircle, XCircle, AlertCircle, QrCode, Plus } from "lucide-react"

interface TestDrive {
  id: string
  customerName: string
  phone: string
  email: string
  vehicle: string
  date: string
  time: string
  status: "scheduled" | "confirmed" | "completed" | "no_show" | "cancelled"
  showroom: string
  bookingCode: string
  notes: string
  createdAt: Date
}

// Mock test drive data
const mockTestDrives: TestDrive[] = [
  {
    id: "1",
    customerName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@email.com",
    vehicle: "VF8",
    date: "2025-01-25",
    time: "10:00",
    status: "confirmed",
    showroom: "Showroom Quận 1",
    bookingCode: "VF240125001",
    notes: "Khách hàng có kinh nghiệm lái xe tự động",
    createdAt: new Date("2025-01-20"),
  },
  {
    id: "2",
    customerName: "Trần Thị B",
    phone: "0912345678",
    email: "tranthib@email.com",
    vehicle: "VF9",
    date: "2025-01-26",
    time: "14:30",
    status: "scheduled",
    showroom: "Showroom Quận 7",
    bookingCode: "VF240126002",
    notes: "Lần đầu lái xe điện",
    createdAt: new Date("2025-01-21"),
  },
  {
    id: "3",
    customerName: "Lê Văn C",
    phone: "0923456789",
    email: "levanc@email.com",
    vehicle: "VF6",
    date: "2025-01-24",
    time: "09:00",
    status: "completed",
    showroom: "Showroom Thủ Đức",
    bookingCode: "VF240124003",
    notes: "Đã hoàn thành, khách hàng rất hài lòng",
    createdAt: new Date("2025-01-22"),
  },
]

export function TestDriveManagement() {
  const [testDrives, setTestDrives] = useState<TestDrive[]>(mockTestDrives)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTestDrive, setSelectedTestDrive] = useState<TestDrive | null>(null)
  const [newTestDrive, setNewTestDrive] = useState({
    customerName: "",
    phone: "",
    email: "",
    vehicle: "",
    date: "",
    time: "",
    showroom: "",
    notes: "",
  })

  const getStatusLabel = (status: string) => {
    const labels = {
      scheduled: "Đã lên lịch",
      confirmed: "Đã xác nhận",
      completed: "Hoàn thành",
      no_show: "Không đến",
      cancelled: "Đã hủy",
    }
    return labels[status as keyof typeof labels] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "bg-blue-500",
      confirmed: "bg-green-500",
      completed: "bg-purple-500",
      no_show: "bg-red-500",
      cancelled: "bg-gray-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "confirmed":
        return <Clock className="h-4 w-4 text-green-600" />
      case "no_show":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-600" />
    }
  }

  const handleCreateTestDrive = () => {
    const testDrive: TestDrive = {
      id: Date.now().toString(),
      ...newTestDrive,
      status: "scheduled",
      bookingCode: `VF${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}${String(testDrives.length + 1).padStart(3, "0")}`,
      createdAt: new Date(),
    }
    setTestDrives([...testDrives, testDrive])
    setIsCreateDialogOpen(false)
    setNewTestDrive({
      customerName: "",
      phone: "",
      email: "",
      vehicle: "",
      date: "",
      time: "",
      showroom: "",
      notes: "",
    })
  }

  const handleUpdateStatus = (testDriveId: string, newStatus: string) => {
    setTestDrives(
      testDrives.map((td) => (td.id === testDriveId ? { ...td, status: newStatus as TestDrive["status"] } : td)),
    )
  }

  const testDriveColumns = [
    {
      key: "bookingCode" as const,
      label: "Mã đặt lịch",
      sortable: true,
    },
    {
      key: "customerName" as const,
      label: "Khách hàng",
      sortable: true,
    },
    {
      key: "phone" as const,
      label: "Điện thoại",
      sortable: true,
    },
    {
      key: "vehicle" as const,
      label: "Xe lái thử",
      sortable: true,
    },
    {
      key: "date" as const,
      label: "Ngày",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      key: "time" as const,
      label: "Giờ",
      sortable: true,
    },
    {
      key: "status" as const,
      label: "Trạng thái",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(value)}
          <Badge className={`${getStatusColor(value)} text-white`}>{getStatusLabel(value)}</Badge>
        </div>
      ),
    },
    {
      key: "showroom" as const,
      label: "Showroom",
      sortable: true,
    },
  ]

  const testDriveActions = (testDrive: TestDrive) => (
    <div className="flex items-center space-x-2">
      {testDrive.status === "scheduled" && (
        <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(testDrive.id, "confirmed")}>
          <CheckCircle className="h-4 w-4" />
        </Button>
      )}
      {testDrive.status === "confirmed" && (
        <>
          <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(testDrive.id, "completed")}>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(testDrive.id, "no_show")}>
            <XCircle className="h-4 w-4 text-red-600" />
          </Button>
        </>
      )}
      <Button variant="ghost" size="sm">
        <QrCode className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý lái thử</h2>
          <p className="text-muted-foreground">Lên lịch và theo dõi các buổi lái thử</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Đặt lịch lái thử
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Đặt lịch lái thử mới</DialogTitle>
              <DialogDescription>Tạo lịch hẹn lái thử cho khách hàng</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Tên khách hàng *</Label>
                  <Input
                    id="customerName"
                    value={newTestDrive.customerName}
                    onChange={(e) => setNewTestDrive({ ...newTestDrive, customerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Điện thoại *</Label>
                  <Input
                    id="phone"
                    value={newTestDrive.phone}
                    onChange={(e) => setNewTestDrive({ ...newTestDrive, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTestDrive.email}
                  onChange={(e) => setNewTestDrive({ ...newTestDrive, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Xe lái thử *</Label>
                  <Select
                    value={newTestDrive.vehicle}
                    onValueChange={(value) => setNewTestDrive({ ...newTestDrive, vehicle: value })}
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
                  <Label htmlFor="showroom">Showroom *</Label>
                  <Select
                    value={newTestDrive.showroom}
                    onValueChange={(value) => setNewTestDrive({ ...newTestDrive, showroom: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn showroom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Showroom Quận 1">Showroom Quận 1</SelectItem>
                      <SelectItem value="Showroom Quận 7">Showroom Quận 7</SelectItem>
                      <SelectItem value="Showroom Thủ Đức">Showroom Thủ Đức</SelectItem>
                      <SelectItem value="Showroom Bình Thạnh">Showroom Bình Thạnh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Ngày *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newTestDrive.date}
                    onChange={(e) => setNewTestDrive({ ...newTestDrive, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Giờ *</Label>
                  <Select
                    value={newTestDrive.time}
                    onValueChange={(value) => setNewTestDrive({ ...newTestDrive, time: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Input
                  id="notes"
                  value={newTestDrive.notes}
                  onChange={(e) => setNewTestDrive({ ...newTestDrive, notes: e.target.value })}
                  placeholder="Thông tin bổ sung..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateTestDrive}>
                Đặt lịch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Test Drive Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries({
          scheduled: "Đã lên lịch",
          confirmed: "Đã xác nhận",
          completed: "Hoàn thành",
          no_show: "Không đến",
          cancelled: "Đã hủy",
        }).map(([status, label]) => {
          const count = testDrives.filter((td) => td.status === status).length
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

      {/* Test Drive Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lái thử</CardTitle>
          <CardDescription>Tổng cộng {testDrives.length} lịch lái thử</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={testDrives}
            columns={testDriveColumns}
            actions={testDriveActions}
            searchable={true}
            exportable={true}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
