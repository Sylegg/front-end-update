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
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Banknote,
  Building,
  Smartphone,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

interface Payment {
  id: string
  orderId: string
  customerId: string
  customerName: string
  amount: number
  currency: "VND" | "USD"
  status: "pending" | "processing" | "completed" | "failed" | "refunded" | "cancelled"
  paymentMethod: "cash" | "bank_transfer" | "credit_card" | "installment" | "crypto"
  paymentProvider?: string
  transactionId?: string
  installmentPlan?: {
    totalMonths: number
    monthlyAmount: number
    paidMonths: number
    nextDueDate: string
    interestRate: number
  }
  description: string
  createdAt: string
  processedAt?: string
  refundedAt?: string
  notes: string
  fees: number
  netAmount: number
  receiptUrl?: string
}

interface PaymentStats {
  totalRevenue: number
  totalTransactions: number
  successfulPayments: number
  pendingPayments: number
  failedPayments: number
  averageTransactionValue: number
  monthlyGrowth: number
  installmentRevenue: number
}

const mockPayments: Payment[] = [
  {
    id: "pay001",
    orderId: "ord001",
    customerId: "cust001",
    customerName: "Nguyễn Văn An",
    amount: 1291000000,
    currency: "VND",
    status: "completed",
    paymentMethod: "bank_transfer",
    paymentProvider: "Vietcombank",
    transactionId: "VCB123456789",
    description: "Thanh toán xe VinFast VF 8",
    createdAt: "2024-12-15",
    processedAt: "2024-12-15",
    notes: "Thanh toán đầy đủ một lần",
    fees: 12910000,
    netAmount: 1278090000,
    receiptUrl: "/receipts/pay001.pdf",
  },
  {
    id: "pay002",
    orderId: "ord002",
    customerId: "cust002",
    customerName: "Trần Thị Mai",
    amount: 765000000,
    currency: "VND",
    status: "processing",
    paymentMethod: "installment",
    paymentProvider: "VinFast Finance",
    installmentPlan: {
      totalMonths: 36,
      monthlyAmount: 25000000,
      paidMonths: 2,
      nextDueDate: "2025-01-15",
      interestRate: 6.9,
    },
    description: "Trả góp xe VinFast VF 6",
    createdAt: "2024-11-15",
    processedAt: "2024-11-15",
    notes: "Trả góp 36 tháng, lãi suất 6.9%",
    fees: 7650000,
    netAmount: 757350000,
  },
  {
    id: "pay003",
    orderId: "ord003",
    customerId: "cust003",
    customerName: "Lê Minh Tuấn",
    amount: 100000000,
    currency: "VND",
    status: "pending",
    paymentMethod: "credit_card",
    paymentProvider: "Visa",
    description: "Đặt cọc xe VinFast VF 7",
    createdAt: "2024-12-18",
    notes: "Đặt cọc 100 triệu",
    fees: 2000000,
    netAmount: 98000000,
  },
  {
    id: "pay004",
    orderId: "ord004",
    customerId: "cust004",
    customerName: "Phạm Thị Lan",
    amount: 50000000,
    currency: "VND",
    status: "failed",
    paymentMethod: "credit_card",
    paymentProvider: "Mastercard",
    description: "Đặt cọc xe VinFast VF 8",
    createdAt: "2024-12-17",
    notes: "Thẻ không đủ hạn mức",
    fees: 0,
    netAmount: 0,
  },
]

const mockStats: PaymentStats = {
  totalRevenue: 45600000000,
  totalTransactions: 1247,
  successfulPayments: 1089,
  pendingPayments: 89,
  failedPayments: 69,
  averageTransactionValue: 36580000,
  monthlyGrowth: 15.3,
  installmentRevenue: 12400000000,
}

export function PaymentManagement() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(mockPayments)
  const [stats, setStats] = useState<PaymentStats>(mockStats)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedMethod, setSelectedMethod] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false)

  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    orderId: "",
    customerId: "",
    customerName: "",
    amount: 0,
    currency: "VND",
    status: "pending",
    paymentMethod: "bank_transfer",
    description: "",
    notes: "",
    fees: 0,
  })

  const statuses = ["all", "pending", "processing", "completed", "failed", "refunded", "cancelled"]
  const paymentMethods = ["all", "cash", "bank_transfer", "credit_card", "installment", "crypto"]
  const currencies = ["VND", "USD"]

  useEffect(() => {
    let filtered = payments

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((payment) => payment.status === selectedStatus)
    }

    if (selectedMethod !== "all") {
      filtered = filtered.filter((payment) => payment.paymentMethod === selectedMethod)
    }

    setFilteredPayments(filtered)
  }, [payments, searchTerm, selectedStatus, selectedMethod])

  const handleAddPayment = () => {
    const payment: Payment = {
      ...(newPayment as Payment),
      id: `pay${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      netAmount: (newPayment.amount || 0) - (newPayment.fees || 0),
    }
    setPayments([...payments, payment])
    setNewPayment({
      orderId: "",
      customerId: "",
      customerName: "",
      amount: 0,
      currency: "VND",
      status: "pending",
      paymentMethod: "bank_transfer",
      description: "",
      notes: "",
      fees: 0,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditPayment = () => {
    if (selectedPayment) {
      setPayments(payments.map((payment) => (payment.id === selectedPayment.id ? selectedPayment : payment)))
      setIsEditDialogOpen(false)
      setSelectedPayment(null)
    }
  }

  const handleRefundPayment = () => {
    if (selectedPayment) {
      const refundedPayment = {
        ...selectedPayment,
        status: "refunded" as const,
        refundedAt: new Date().toISOString().split("T")[0],
      }
      setPayments(payments.map((payment) => (payment.id === selectedPayment.id ? refundedPayment : payment)))
      setIsRefundDialogOpen(false)
      setSelectedPayment(null)
    }
  }

  const handleDeletePayment = (paymentId: string) => {
    setPayments(payments.filter((payment) => payment.id !== paymentId))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Chờ xử lý", className: "bg-yellow-500", icon: Clock },
      processing: { label: "Đang xử lý", className: "bg-blue-500", icon: Clock },
      completed: { label: "Hoàn thành", className: "bg-green-500", icon: CheckCircle },
      failed: { label: "Thất bại", className: "bg-red-500", icon: XCircle },
      refunded: { label: "Hoàn tiền", className: "bg-purple-500", icon: AlertTriangle },
      cancelled: { label: "Đã hủy", className: "bg-gray-500", icon: XCircle },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    return (
      <Badge className={config.className}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getMethodBadge = (method: string) => {
    const methodConfig = {
      cash: { label: "Tiền mặt", icon: Banknote },
      bank_transfer: { label: "Chuyển khoản", icon: Building },
      credit_card: { label: "Thẻ tín dụng", icon: CreditCard },
      installment: { label: "Trả góp", icon: Calendar },
      crypto: { label: "Tiền điện tử", icon: Smartphone },
    }
    const config = methodConfig[method as keyof typeof methodConfig]
    const Icon = config.icon
    return (
      <Badge variant="outline">
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const formatPrice = (price: number, currency = "VND") => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const canManagePayments = user?.permissions?.includes("manage_payments") || user?.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý thanh toán</h2>
          <p className="text-muted-foreground">Theo dõi và xử lý các giao dịch thanh toán</p>
        </div>
        {canManagePayments && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm giao dịch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm giao dịch thanh toán</DialogTitle>
                <DialogDescription>Tạo giao dịch thanh toán mới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderId">Mã đơn hàng</Label>
                    <Input
                      id="orderId"
                      value={newPayment.orderId}
                      onChange={(e) => setNewPayment({ ...newPayment, orderId: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Tên khách hàng</Label>
                    <Input
                      id="customerName"
                      value={newPayment.customerName}
                      onChange={(e) => setNewPayment({ ...newPayment, customerName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Số tiền</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Tiền tệ</Label>
                    <Select
                      value={newPayment.currency}
                      onValueChange={(value: "VND" | "USD") => setNewPayment({ ...newPayment, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VND">VND</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fees">Phí giao dịch</Label>
                    <Input
                      id="fees"
                      type="number"
                      value={newPayment.fees}
                      onChange={(e) => setNewPayment({ ...newPayment, fees: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
                    <Select
                      value={newPayment.paymentMethod}
                      onValueChange={(value: any) => setNewPayment({ ...newPayment, paymentMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Tiền mặt</SelectItem>
                        <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                        <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                        <SelectItem value="installment">Trả góp</SelectItem>
                        <SelectItem value="crypto">Tiền điện tử</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select
                      value={newPayment.status}
                      onValueChange={(value: any) => setNewPayment({ ...newPayment, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                        <SelectItem value="processing">Đang xử lý</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="failed">Thất bại</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Input
                    id="description"
                    value={newPayment.description}
                    onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddPayment}>Tạo giao dịch</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Tất cả giao dịch</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giao dịch thành công</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.successfulPayments}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.successfulPayments / stats.totalTransactions) * 100).toFixed(1)}% tỷ lệ thành công
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Cần xử lý</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trị trung bình</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.averageTransactionValue)}</div>
            <p className="text-xs text-muted-foreground">Mỗi giao dịch</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tăng trưởng tháng này</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">+{stats.monthlyGrowth}%</div>
            <p className="text-sm text-muted-foreground">So với tháng trước</p>
            <Progress value={stats.monthlyGrowth} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Doanh thu trả góp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatPrice(stats.installmentRevenue)}</div>
            <p className="text-sm text-muted-foreground">
              {((stats.installmentRevenue / stats.totalRevenue) * 100).toFixed(1)}% tổng doanh thu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo khách hàng, đơn hàng, mã giao dịch..."
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
                  : status === "pending"
                    ? "Chờ xử lý"
                    : status === "processing"
                      ? "Đang xử lý"
                      : status === "completed"
                        ? "Hoàn thành"
                        : status === "failed"
                          ? "Thất bại"
                          : status === "refunded"
                            ? "Hoàn tiền"
                            : "Đã hủy"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedMethod} onValueChange={setSelectedMethod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Phương thức" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((method) => (
              <SelectItem key={method} value={method}>
                {method === "all"
                  ? "Tất cả phương thức"
                  : method === "cash"
                    ? "Tiền mặt"
                    : method === "bank_transfer"
                      ? "Chuyển khoản"
                      : method === "credit_card"
                        ? "Thẻ tín dụng"
                        : method === "installment"
                          ? "Trả góp"
                          : "Tiền điện tử"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách giao dịch</CardTitle>
          <CardDescription>Quản lý chi tiết các giao dịch thanh toán</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Giao dịch</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.id}</div>
                      <div className="text-sm text-muted-foreground">Đơn: {payment.orderId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{payment.customerName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatPrice(payment.amount, payment.currency)}</div>
                    {payment.fees > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Phí: {formatPrice(payment.fees, payment.currency)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getMethodBadge(payment.paymentMethod)}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{payment.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPayment(payment)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            Xem
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết giao dịch - {payment.id}</DialogTitle>
                            <DialogDescription>Thông tin chi tiết giao dịch thanh toán</DialogDescription>
                          </DialogHeader>
                          {selectedPayment && (
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">Chi tiết</TabsTrigger>
                                <TabsTrigger value="installment">Trả góp</TabsTrigger>
                                <TabsTrigger value="history">Lịch sử</TabsTrigger>
                              </TabsList>
                              <TabsContent value="details" className="space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-3">Thông tin giao dịch</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Mã giao dịch:</span>
                                        <span className="font-mono">{selectedPayment.id}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Đơn hàng:</span>
                                        <span>{selectedPayment.orderId}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Khách hàng:</span>
                                        <span>{selectedPayment.customerName}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Mô tả:</span>
                                        <span>{selectedPayment.description}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-3">Thông tin thanh toán</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Số tiền:</span>
                                        <span className="font-semibold">
                                          {formatPrice(selectedPayment.amount, selectedPayment.currency)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Phí giao dịch:</span>
                                        <span>{formatPrice(selectedPayment.fees, selectedPayment.currency)}</span>
                                      </div>
                                      <Separator />
                                      <div className="flex justify-between font-semibold">
                                        <span>Số tiền thực nhận:</span>
                                        <span className="text-green-600">
                                          {formatPrice(selectedPayment.netAmount, selectedPayment.currency)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-3">Phương thức & Trạng thái</h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span>Phương thức:</span>
                                        {getMethodBadge(selectedPayment.paymentMethod)}
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span>Trạng thái:</span>
                                        {getStatusBadge(selectedPayment.status)}
                                      </div>
                                      {selectedPayment.paymentProvider && (
                                        <div className="flex justify-between">
                                          <span>Nhà cung cấp:</span>
                                          <span>{selectedPayment.paymentProvider}</span>
                                        </div>
                                      )}
                                      {selectedPayment.transactionId && (
                                        <div className="flex justify-between">
                                          <span>Mã giao dịch:</span>
                                          <span className="font-mono">{selectedPayment.transactionId}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-3">Thời gian</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Ngày tạo:</span>
                                        <span>{selectedPayment.createdAt}</span>
                                      </div>
                                      {selectedPayment.processedAt && (
                                        <div className="flex justify-between">
                                          <span>Ngày xử lý:</span>
                                          <span>{selectedPayment.processedAt}</span>
                                        </div>
                                      )}
                                      {selectedPayment.refundedAt && (
                                        <div className="flex justify-between">
                                          <span>Ngày hoàn tiền:</span>
                                          <span>{selectedPayment.refundedAt}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {selectedPayment.notes && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Ghi chú</h4>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                      {selectedPayment.notes}
                                    </p>
                                  </div>
                                )}
                              </TabsContent>
                              <TabsContent value="installment" className="space-y-4">
                                {selectedPayment.installmentPlan ? (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-6">
                                      <Card>
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-sm">Tiến độ thanh toán</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                              <span>Đã thanh toán:</span>
                                              <span>
                                                {selectedPayment.installmentPlan.paidMonths}/
                                                {selectedPayment.installmentPlan.totalMonths} tháng
                                              </span>
                                            </div>
                                            <Progress
                                              value={
                                                (selectedPayment.installmentPlan.paidMonths /
                                                  selectedPayment.installmentPlan.totalMonths) *
                                                100
                                              }
                                            />
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-sm">Thông tin trả góp</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                              <span>Số tiền hàng tháng:</span>
                                              <span className="font-semibold">
                                                {formatPrice(selectedPayment.installmentPlan.monthlyAmount)}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span>Lãi suất:</span>
                                              <span>{selectedPayment.installmentPlan.interestRate}%/năm</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span>Kỳ hạn tiếp theo:</span>
                                              <span>{selectedPayment.installmentPlan.nextDueDate}</span>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-8">
                                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-semibold">Không phải trả góp</h3>
                                    <p className="text-muted-foreground">
                                      Giao dịch này không sử dụng hình thức trả góp
                                    </p>
                                  </div>
                                )}
                              </TabsContent>
                              <TabsContent value="history" className="space-y-4">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1">
                                      <div className="font-medium">Giao dịch được tạo</div>
                                      <div className="text-sm text-muted-foreground">{selectedPayment.createdAt}</div>
                                    </div>
                                  </div>
                                  {selectedPayment.processedAt && (
                                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <div className="flex-1">
                                        <div className="font-medium">Giao dịch được xử lý</div>
                                        <div className="text-sm text-muted-foreground">
                                          {selectedPayment.processedAt}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {selectedPayment.refundedAt && (
                                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                      <div className="flex-1">
                                        <div className="font-medium">Giao dịch được hoàn tiền</div>
                                        <div className="text-sm text-muted-foreground">
                                          {selectedPayment.refundedAt}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>

                      {canManagePayments && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPayment(payment)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Chỉnh sửa giao dịch</DialogTitle>
                                <DialogDescription>Cập nhật thông tin giao dịch</DialogDescription>
                              </DialogHeader>
                              {selectedPayment && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-status">Trạng thái</Label>
                                      <Select
                                        value={selectedPayment.status}
                                        onValueChange={(value: any) =>
                                          setSelectedPayment({ ...selectedPayment, status: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Chờ xử lý</SelectItem>
                                          <SelectItem value="processing">Đang xử lý</SelectItem>
                                          <SelectItem value="completed">Hoàn thành</SelectItem>
                                          <SelectItem value="failed">Thất bại</SelectItem>
                                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-transactionId">Mã giao dịch</Label>
                                      <Input
                                        id="edit-transactionId"
                                        value={selectedPayment.transactionId || ""}
                                        onChange={(e) =>
                                          setSelectedPayment({ ...selectedPayment, transactionId: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-notes">Ghi chú</Label>
                                    <Textarea
                                      id="edit-notes"
                                      value={selectedPayment.notes}
                                      onChange={(e) =>
                                        setSelectedPayment({ ...selectedPayment, notes: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Hủy
                                </Button>
                                <Button onClick={handleEditPayment}>Cập nhật</Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {payment.status === "completed" && (
                            <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedPayment(payment)}>
                                  Hoàn tiền
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Xác nhận hoàn tiền</DialogTitle>
                                  <DialogDescription>
                                    Bạn có chắc chắn muốn hoàn tiền cho giao dịch này?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <p className="text-sm">
                                    Số tiền hoàn: <strong>{formatPrice(payment.amount, payment.currency)}</strong>
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Hành động này không thể hoàn tác.
                                  </p>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
                                    Hủy
                                  </Button>
                                  <Button variant="destructive" onClick={handleRefundPayment}>
                                    Xác nhận hoàn tiền
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          <Button variant="outline" size="sm" onClick={() => handleDeletePayment(payment.id)}>
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

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Không tìm thấy giao dịch</h3>
          <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  )
}
