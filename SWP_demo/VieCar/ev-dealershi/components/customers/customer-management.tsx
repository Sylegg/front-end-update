"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Search, Users, UserCheck, Phone, Mail, Star, TrendingUp } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  status: "active" | "inactive" | "vip" | "blacklisted"
  customerType: "individual" | "corporate"
  companyName?: string
  taxId?: string
  preferredContact: "email" | "phone" | "sms"
  interests: string[]
  budget: {
    min: number
    max: number
  }
  leadSource: string
  assignedSalesperson: string
  notes: string
  createdAt: string
  lastContact: string
  totalPurchases: number
  totalSpent: number
  vehiclesPurchased: string[]
  testDrives: number
  quotesRequested: number
  satisfaction: number
}

interface CustomerStats {
  totalCustomers: number
  activeCustomers: number
  vipCustomers: number
  newThisMonth: number
  averageSatisfaction: number
  totalRevenue: number
  conversionRate: number
}

const mockCustomers: Customer[] = [
  {
    id: "cust001",
    firstName: "Nguyễn",
    lastName: "Văn An",
    email: "nguyen.van.an@email.com",
    phone: "0901234567",
    address: "123 Đường ABC",
    city: "Hà Nội",
    province: "Hà Nội",
    postalCode: "100000",
    dateOfBirth: "1985-05-15",
    gender: "male",
    status: "vip",
    customerType: "individual",
    preferredContact: "phone",
    interests: ["VF 8", "VF 9", "SUV"],
    budget: { min: 1000000000, max: 1500000000 },
    leadSource: "Website",
    assignedSalesperson: "Trần Thị B",
    notes: "Khách hàng VIP, đã mua 2 xe",
    createdAt: "2024-01-15",
    lastContact: "2024-12-18",
    totalPurchases: 2,
    totalSpent: 2782000000,
    vehiclesPurchased: ["VF 8", "VF 9"],
    testDrives: 3,
    quotesRequested: 5,
    satisfaction: 5,
  },
  {
    id: "cust002",
    firstName: "Trần",
    lastName: "Thị Mai",
    email: "tran.thi.mai@company.com",
    phone: "0912345678",
    address: "456 Đường XYZ",
    city: "TP.HCM",
    province: "TP.HCM",
    postalCode: "700000",
    dateOfBirth: "1990-08-22",
    gender: "female",
    status: "active",
    customerType: "corporate",
    companyName: "Công ty ABC",
    taxId: "0123456789",
    preferredContact: "email",
    interests: ["VF 6", "VF 7"],
    budget: { min: 700000000, max: 1000000000 },
    leadSource: "Referral",
    assignedSalesperson: "Lê Văn C",
    notes: "Quan tâm mua xe cho công ty",
    createdAt: "2024-03-10",
    lastContact: "2024-12-15",
    totalPurchases: 0,
    totalSpent: 0,
    vehiclesPurchased: [],
    testDrives: 2,
    quotesRequested: 3,
    satisfaction: 4,
  },
  {
    id: "cust003",
    firstName: "Lê",
    lastName: "Minh Tuấn",
    email: "le.minh.tuan@email.com",
    phone: "0923456789",
    address: "789 Đường DEF",
    city: "Đà Nẵng",
    province: "Đà Nẵng",
    postalCode: "550000",
    dateOfBirth: "1988-12-03",
    gender: "male",
    status: "active",
    customerType: "individual",
    preferredContact: "sms",
    interests: ["VF 6"],
    budget: { min: 600000000, max: 800000000 },
    leadSource: "Social Media",
    assignedSalesperson: "Phạm Thị D",
    notes: "Khách hàng trẻ, thích công nghệ",
    createdAt: "2024-06-20",
    lastContact: "2024-12-10",
    totalPurchases: 1,
    totalSpent: 765000000,
    vehiclesPurchased: ["VF 6"],
    testDrives: 1,
    quotesRequested: 2,
    satisfaction: 5,
  },
]

const mockStats: CustomerStats = {
  totalCustomers: 1247,
  activeCustomers: 1089,
  vipCustomers: 156,
  newThisMonth: 89,
  averageSatisfaction: 4.3,
  totalRevenue: 156780000000,
  conversionRate: 23.5,
}

export function CustomerManagement() {
  const { user } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers)
  const [stats, setStats] = useState<CustomerStats>(mockStats)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    dateOfBirth: "",
    gender: "male",
    status: "active",
    customerType: "individual",
    preferredContact: "email",
    interests: [],
    budget: { min: 0, max: 0 },
    leadSource: "",
    assignedSalesperson: "",
    notes: "",
  })

  const statuses = ["all", "active", "inactive", "vip", "blacklisted"]
  const customerTypes = ["all", "individual", "corporate"]
  const leadSources = ["Website", "Referral", "Social Media", "Advertisement", "Walk-in", "Phone Call"]
  const salespeople = ["Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"]

  useEffect(() => {
    let filtered = customers

    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm),
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((customer) => customer.status === selectedStatus)
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((customer) => customer.customerType === selectedType)
    }

    setFilteredCustomers(filtered)
  }, [customers, searchTerm, selectedStatus, selectedType])

  const handleAddCustomer = () => {
    const customer: Customer = {
      ...(newCustomer as Customer),
      id: `cust${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      lastContact: new Date().toISOString().split("T")[0],
      totalPurchases: 0,
      totalSpent: 0,
      vehiclesPurchased: [],
      testDrives: 0,
      quotesRequested: 0,
      satisfaction: 0,
    }
    setCustomers([...customers, customer])
    setNewCustomer({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      dateOfBirth: "",
      gender: "male",
      status: "active",
      customerType: "individual",
      preferredContact: "email",
      interests: [],
      budget: { min: 0, max: 0 },
      leadSource: "",
      assignedSalesperson: "",
      notes: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditCustomer = () => {
    if (selectedCustomer) {
      setCustomers(customers.map((customer) => (customer.id === selectedCustomer.id ? selectedCustomer : customer)))
      setIsEditDialogOpen(false)
      setSelectedCustomer(null)
    }
  }

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter((customer) => customer.id !== customerId))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Hoạt động", className: "bg-green-500" },
      inactive: { label: "Không hoạt động", className: "bg-gray-500" },
      vip: { label: "VIP", className: "bg-yellow-500" },
      blacklisted: { label: "Danh sách đen", className: "bg-red-500" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const canManageCustomers = user?.permissions?.includes("manage_customers") || user?.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h2>
          <p className="text-muted-foreground">Quản lý thông tin và tương tác với khách hàng</p>
        </div>
        {canManageCustomers && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm khách hàng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm khách hàng mới</DialogTitle>
                <DialogDescription>Nhập thông tin chi tiết cho khách hàng mới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Họ</Label>
                    <Input
                      id="firstName"
                      value={newCustomer.firstName}
                      onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
                    <Input
                      id="lastName"
                      value={newCustomer.lastName}
                      onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerType">Loại khách hàng</Label>
                    <Select
                      value={newCustomer.customerType}
                      onValueChange={(value: "individual" | "corporate") =>
                        setNewCustomer({ ...newCustomer, customerType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Cá nhân</SelectItem>
                        <SelectItem value="corporate">Doanh nghiệp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select
                      value={newCustomer.status}
                      onValueChange={(value: "active" | "inactive" | "vip" | "blacklisted") =>
                        setNewCustomer({ ...newCustomer, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="blacklisted">Danh sách đen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredContact">Liên hệ ưa thích</Label>
                    <Select
                      value={newCustomer.preferredContact}
                      onValueChange={(value: "email" | "phone" | "sms") =>
                        setNewCustomer({ ...newCustomer, preferredContact: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Điện thoại</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Thành phố</Label>
                    <Input
                      id="city"
                      value={newCustomer.city}
                      onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Tỉnh/Thành</Label>
                    <Input
                      id="province"
                      value={newCustomer.province}
                      onChange={(e) => setNewCustomer({ ...newCustomer, province: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Mã bưu điện</Label>
                    <Input
                      id="postalCode"
                      value={newCustomer.postalCode}
                      onChange={(e) => setNewCustomer({ ...newCustomer, postalCode: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    value={newCustomer.notes}
                    onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddCustomer}>Thêm khách hàng</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Tất cả khách hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng hoạt động</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng VIP</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.vipCustomers}</div>
            <p className="text-xs text-muted-foreground">Khách hàng cao cấp</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mới tháng này</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">+15% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tỷ lệ chuyển đổi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.conversionRate}%</div>
            <p className="text-sm text-muted-foreground">Từ khách tiềm năng thành khách hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Độ hài lòng trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{stats.averageSatisfaction}</div>
              <div className="flex">{renderStars(Math.round(stats.averageSatisfaction))}</div>
            </div>
            <p className="text-sm text-muted-foreground">Đánh giá từ khách hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-sm text-muted-foreground">Từ tất cả khách hàng</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "all"
                  ? "Tất cả trạng thái"
                  : status === "active"
                    ? "Hoạt động"
                    : status === "inactive"
                      ? "Không hoạt động"
                      : status === "vip"
                        ? "VIP"
                        : "Danh sách đen"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Loại khách hàng" />
          </SelectTrigger>
          <SelectContent>
            {customerTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type === "all" ? "Tất cả loại" : type === "individual" ? "Cá nhân" : "Doanh nghiệp"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
          <CardDescription>Quản lý thông tin chi tiết khách hàng</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Đã mua</TableHead>
                <TableHead>Tổng chi tiêu</TableHead>
                <TableHead>Hài lòng</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{`${customer.firstName} ${customer.lastName}`}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.customerType === "corporate" && customer.companyName
                          ? customer.companyName
                          : customer.city}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {customer.customerType === "individual" ? "Cá nhân" : "Doanh nghiệp"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{customer.totalPurchases}</div>
                      <div className="text-xs text-muted-foreground">xe</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(customer.totalSpent)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div className="flex">{renderStars(customer.satisfaction)}</div>
                      <span className="text-sm">({customer.satisfaction})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCustomer(customer)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            Xem
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Chi tiết khách hàng - {`${customer.firstName} ${customer.lastName}`}
                            </DialogTitle>
                            <DialogDescription>Thông tin chi tiết và lịch sử tương tác</DialogDescription>
                          </DialogHeader>
                          {selectedCustomer && (
                            <Tabs defaultValue="info" className="w-full">
                              <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="info">Thông tin</TabsTrigger>
                                <TabsTrigger value="history">Lịch sử</TabsTrigger>
                                <TabsTrigger value="preferences">Sở thích</TabsTrigger>
                                <TabsTrigger value="notes">Ghi chú</TabsTrigger>
                              </TabsList>
                              <TabsContent value="info" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Thông tin cá nhân</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Họ tên:</span>
                                        <span>{`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Email:</span>
                                        <span>{selectedCustomer.email}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Điện thoại:</span>
                                        <span>{selectedCustomer.phone}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Ngày sinh:</span>
                                        <span>{selectedCustomer.dateOfBirth}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Địa chỉ</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Địa chỉ:</span>
                                        <span>{selectedCustomer.address}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Thành phố:</span>
                                        <span>{selectedCustomer.city}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Tỉnh/Thành:</span>
                                        <span>{selectedCustomer.province}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Mã bưu điện:</span>
                                        <span>{selectedCustomer.postalCode}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="history" className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Xe đã mua</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold">{selectedCustomer.totalPurchases}</div>
                                      <p className="text-xs text-muted-foreground">
                                        {selectedCustomer.vehiclesPurchased.join(", ") || "Chưa mua xe nào"}
                                      </p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Lái thử</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold">{selectedCustomer.testDrives}</div>
                                      <p className="text-xs text-muted-foreground">lần</p>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Báo giá</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold">{selectedCustomer.quotesRequested}</div>
                                      <p className="text-xs text-muted-foreground">yêu cầu</p>
                                    </CardContent>
                                  </Card>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Tổng chi tiêu</h4>
                                  <div className="text-2xl font-bold text-green-600">
                                    {formatPrice(selectedCustomer.totalSpent)}
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="preferences" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Sở thích xe</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedCustomer.interests.map((interest, index) => (
                                        <Badge key={index} variant="outline">
                                          {interest}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Ngân sách</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Tối thiểu:</span>
                                        <span>{formatPrice(selectedCustomer.budget.min)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Tối đa:</span>
                                        <span>{formatPrice(selectedCustomer.budget.max)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Nguồn khách hàng</h4>
                                    <Badge>{selectedCustomer.leadSource}</Badge>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Nhân viên phụ trách</h4>
                                    <p>{selectedCustomer.assignedSalesperson}</p>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="notes" className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Ghi chú</h4>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {selectedCustomer.notes || "Chưa có ghi chú"}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Ngày tạo:</span>
                                    <p>{selectedCustomer.createdAt}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Liên hệ cuối:</span>
                                    <p>{selectedCustomer.lastContact}</p>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>

                      {canManageCustomers && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedCustomer(customer)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Chỉnh sửa thông tin khách hàng</DialogTitle>
                                <DialogDescription>Cập nhật thông tin khách hàng</DialogDescription>
                              </DialogHeader>
                              {selectedCustomer && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-status">Trạng thái</Label>
                                      <Select
                                        value={selectedCustomer.status}
                                        onValueChange={(value: any) =>
                                          setSelectedCustomer({ ...selectedCustomer, status: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="active">Hoạt động</SelectItem>
                                          <SelectItem value="inactive">Không hoạt động</SelectItem>
                                          <SelectItem value="vip">VIP</SelectItem>
                                          <SelectItem value="blacklisted">Danh sách đen</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-salesperson">Nhân viên phụ trách</Label>
                                      <Select
                                        value={selectedCustomer.assignedSalesperson}
                                        onValueChange={(value) =>
                                          setSelectedCustomer({ ...selectedCustomer, assignedSalesperson: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {salespeople.map((person) => (
                                            <SelectItem key={person} value={person}>
                                              {person}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-notes">Ghi chú</Label>
                                    <Textarea
                                      id="edit-notes"
                                      value={selectedCustomer.notes}
                                      onChange={(e) =>
                                        setSelectedCustomer({ ...selectedCustomer, notes: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Hủy
                                </Button>
                                <Button onClick={handleEditCustomer}>Cập nhật</Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm" onClick={() => handleDeleteCustomer(customer.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Không tìm thấy khách hàng</h3>
          <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  )
}
