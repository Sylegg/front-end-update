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
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Tag,
  Gift,
  Percent,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Eye,
  BarChart3,
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

interface Promotion {
  id: string
  title: string
  description: string
  type: "discount" | "cashback" | "trade_in" | "financing" | "service" | "bundle"
  discountType: "percentage" | "fixed_amount" | "buy_one_get_one"
  discountValue: number
  minPurchaseAmount?: number
  maxDiscountAmount?: number
  applicableModels: string[]
  customerSegments: string[]
  startDate: string
  endDate: string
  status: "draft" | "active" | "paused" | "expired" | "cancelled"
  usageLimit?: number
  usageCount: number
  perCustomerLimit?: number
  requiresCouponCode: boolean
  couponCode?: string
  autoApply: boolean
  stackable: boolean
  priority: number
  terms: string
  createdBy: string
  createdAt: string
  updatedAt: string
  analytics: {
    views: number
    clicks: number
    conversions: number
    revenue: number
    conversionRate: number
  }
}

interface PromotionStats {
  totalPromotions: number
  activePromotions: number
  totalSavings: number
  totalRevenue: number
  averageConversionRate: number
  topPerformingPromotion: string
  expiringThisWeek: number
}

const mockPromotions: Promotion[] = [
  {
    id: "promo001",
    title: "Ưu đãi đặc biệt tháng 1",
    description: "Giảm ngay 50 triệu đồng cho VF 8 và VF 9",
    type: "discount",
    discountType: "fixed_amount",
    discountValue: 50000000,
    minPurchaseAmount: 1000000000,
    applicableModels: ["VF 8", "VF 9"],
    customerSegments: ["all"],
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "active",
    usageLimit: 100,
    usageCount: 23,
    perCustomerLimit: 1,
    requiresCouponCode: false,
    couponCode: "",
    autoApply: true,
    stackable: false,
    priority: 1,
    terms: "Áp dụng cho khách hàng mua xe VF 8 hoặc VF 9 trong tháng 1/2025",
    createdBy: "Admin",
    createdAt: "2024-12-15",
    updatedAt: "2024-12-20",
    analytics: {
      views: 1250,
      clicks: 340,
      conversions: 23,
      revenue: 1150000000,
      conversionRate: 6.8,
    },
  },
  {
    id: "promo002",
    title: "Miễn phí sạc 2 năm",
    description: "Miễn phí sạc tại hệ thống trạm sạc V-GREEN",
    type: "service",
    discountType: "fixed_amount",
    discountValue: 24000000,
    applicableModels: ["VF 6", "VF 7", "VF 8", "VF 9"],
    customerSegments: ["all"],
    startDate: "2025-01-01",
    endDate: "2025-02-28",
    status: "active",
    usageCount: 45,
    requiresCouponCode: false,
    autoApply: true,
    stackable: true,
    priority: 2,
    terms: "Miễn phí sạc trong 2 năm đầu tại tất cả trạm sạc V-GREEN",
    createdBy: "Marketing Manager",
    createdAt: "2024-12-10",
    updatedAt: "2024-12-18",
    analytics: {
      views: 2100,
      clicks: 580,
      conversions: 45,
      revenue: 1080000000,
      conversionRate: 7.8,
    },
  },
  {
    id: "promo003",
    title: "Hỗ trợ vay 0% lãi suất",
    description: "Vay mua xe với lãi suất 0% trong 12 tháng đầu",
    type: "financing",
    discountType: "percentage",
    discountValue: 100,
    minPurchaseAmount: 500000000,
    applicableModels: ["VF 6", "VF 7"],
    customerSegments: ["individual", "first_time_buyer"],
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    status: "active",
    usageLimit: 50,
    usageCount: 12,
    perCustomerLimit: 1,
    requiresCouponCode: true,
    couponCode: "ZEROLOAN2025",
    autoApply: false,
    stackable: false,
    priority: 3,
    terms: "Áp dụng cho khách hàng cá nhân mua xe VF 6 hoặc VF 7 lần đầu",
    createdBy: "Finance Manager",
    createdAt: "2024-12-01",
    updatedAt: "2024-12-15",
    analytics: {
      views: 890,
      clicks: 156,
      conversions: 12,
      revenue: 918000000,
      conversionRate: 7.7,
    },
  },
  {
    id: "promo004",
    title: "Trade-in xe cũ",
    description: "Đổi xe cũ lấy xe mới với giá ưu đãi",
    type: "trade_in",
    discountType: "percentage",
    discountValue: 15,
    maxDiscountAmount: 200000000,
    applicableModels: ["VF 8", "VF 9"],
    customerSegments: ["existing_customer"],
    startDate: "2024-12-01",
    endDate: "2025-06-30",
    status: "active",
    usageCount: 8,
    requiresCouponCode: false,
    autoApply: false,
    stackable: true,
    priority: 4,
    terms: "Áp dụng cho khách hàng có xe cũ muốn đổi lấy xe VinFast mới",
    createdBy: "Sales Manager",
    createdAt: "2024-11-25",
    updatedAt: "2024-12-10",
    analytics: {
      views: 650,
      clicks: 89,
      conversions: 8,
      revenue: 1600000000,
      conversionRate: 9.0,
    },
  },
]

const mockStats: PromotionStats = {
  totalPromotions: 12,
  activePromotions: 8,
  totalSavings: 2340000000,
  totalRevenue: 4748000000,
  averageConversionRate: 7.8,
  topPerformingPromotion: "Miễn phí sạc 2 năm",
  expiringThisWeek: 2,
}

export function PromotionManagement() {
  const { user } = useAuth()
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions)
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>(mockPromotions)
  const [stats, setStats] = useState<PromotionStats>(mockStats)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const [newPromotion, setNewPromotion] = useState<Partial<Promotion>>({
    title: "",
    description: "",
    type: "discount",
    discountType: "percentage",
    discountValue: 0,
    applicableModels: [],
    customerSegments: ["all"],
    startDate: "",
    endDate: "",
    status: "draft",
    requiresCouponCode: false,
    autoApply: true,
    stackable: false,
    priority: 1,
    terms: "",
  })

  const statuses = ["all", "draft", "active", "paused", "expired", "cancelled"]
  const promotionTypes = ["all", "discount", "cashback", "trade_in", "financing", "service", "bundle"]
  const discountTypes = ["percentage", "fixed_amount", "buy_one_get_one"]
  const vehicleModels = ["VF 6", "VF 7", "VF 8", "VF 9"]
  const customerSegments = ["all", "individual", "corporate", "vip", "first_time_buyer", "existing_customer"]

  useEffect(() => {
    let filtered = promotions

    if (searchTerm) {
      filtered = filtered.filter(
        (promotion) =>
          promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          promotion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          promotion.couponCode?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((promotion) => promotion.status === selectedStatus)
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((promotion) => promotion.type === selectedType)
    }

    setFilteredPromotions(filtered)
  }, [promotions, searchTerm, selectedStatus, selectedType])

  const handleAddPromotion = () => {
    const promotion: Promotion = {
      ...(newPromotion as Promotion),
      id: `promo${Date.now()}`,
      usageCount: 0,
      createdBy: user?.name || "Unknown",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      analytics: {
        views: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        conversionRate: 0,
      },
    }
    setPromotions([...promotions, promotion])
    setNewPromotion({
      title: "",
      description: "",
      type: "discount",
      discountType: "percentage",
      discountValue: 0,
      applicableModels: [],
      customerSegments: ["all"],
      startDate: "",
      endDate: "",
      status: "draft",
      requiresCouponCode: false,
      autoApply: true,
      stackable: false,
      priority: 1,
      terms: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditPromotion = () => {
    if (selectedPromotion) {
      setPromotions(
        promotions.map((promotion) =>
          promotion.id === selectedPromotion.id
            ? { ...selectedPromotion, updatedAt: new Date().toISOString().split("T")[0] }
            : promotion,
        ),
      )
      setIsEditDialogOpen(false)
      setSelectedPromotion(null)
    }
  }

  const handleDeletePromotion = (promotionId: string) => {
    setPromotions(promotions.filter((promotion) => promotion.id !== promotionId))
  }

  const handleDuplicatePromotion = (promotion: Promotion) => {
    const duplicatedPromotion: Promotion = {
      ...promotion,
      id: `promo${Date.now()}`,
      title: `${promotion.title} (Copy)`,
      status: "draft",
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      analytics: {
        views: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        conversionRate: 0,
      },
    }
    setPromotions([...promotions, duplicatedPromotion])
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Nháp", className: "bg-gray-500", icon: Edit },
      active: { label: "Đang chạy", className: "bg-green-500", icon: CheckCircle },
      paused: { label: "Tạm dừng", className: "bg-yellow-500", icon: Clock },
      expired: { label: "Hết hạn", className: "bg-red-500", icon: XCircle },
      cancelled: { label: "Đã hủy", className: "bg-gray-600", icon: XCircle },
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

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      discount: { label: "Giảm giá", icon: Percent },
      cashback: { label: "Hoàn tiền", icon: Gift },
      trade_in: { label: "Đổi xe", icon: TrendingUp },
      financing: { label: "Tài chính", icon: BarChart3 },
      service: { label: "Dịch vụ", icon: Tag },
      bundle: { label: "Combo", icon: Gift },
    }
    const config = typeConfig[type as keyof typeof typeConfig]
    const Icon = config.icon
    return (
      <Badge variant="outline">
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatDiscount = (promotion: Promotion) => {
    if (promotion.discountType === "percentage") {
      return `${promotion.discountValue}%`
    } else if (promotion.discountType === "fixed_amount") {
      return formatPrice(promotion.discountValue)
    } else {
      return "Mua 1 tặng 1"
    }
  }

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date()
    const expiry = new Date(endDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const canManagePromotions = user?.permissions?.includes("manage_promotions") || user?.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý khuyến mãi</h2>
          <p className="text-muted-foreground">Tạo và quản lý các chương trình khuyến mãi</p>
        </div>
        {canManagePromotions && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tạo khuyến mãi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo chương trình khuyến mãi mới</DialogTitle>
                <DialogDescription>Thiết lập chi tiết cho chương trình khuyến mãi</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề</Label>
                    <Input
                      id="title"
                      value={newPromotion.title}
                      onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Loại khuyến mãi</Label>
                    <Select
                      value={newPromotion.type}
                      onValueChange={(value: any) => setNewPromotion({ ...newPromotion, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discount">Giảm giá</SelectItem>
                        <SelectItem value="cashback">Hoàn tiền</SelectItem>
                        <SelectItem value="trade_in">Đổi xe</SelectItem>
                        <SelectItem value="financing">Tài chính</SelectItem>
                        <SelectItem value="service">Dịch vụ</SelectItem>
                        <SelectItem value="bundle">Combo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Loại giảm giá</Label>
                    <Select
                      value={newPromotion.discountType}
                      onValueChange={(value: any) => setNewPromotion({ ...newPromotion, discountType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Phần trăm</SelectItem>
                        <SelectItem value="fixed_amount">Số tiền cố định</SelectItem>
                        <SelectItem value="buy_one_get_one">Mua 1 tặng 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Giá trị giảm</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      value={newPromotion.discountValue}
                      onChange={(e) => setNewPromotion({ ...newPromotion, discountValue: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Độ ưu tiên</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="1"
                      max="10"
                      value={newPromotion.priority}
                      onChange={(e) => setNewPromotion({ ...newPromotion, priority: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Ngày bắt đầu</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newPromotion.startDate}
                      onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Ngày kết thúc</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newPromotion.endDate}
                      onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Model áp dụng</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {vehicleModels.map((model) => (
                      <div key={model} className="flex items-center space-x-2">
                        <Checkbox
                          id={model}
                          checked={newPromotion.applicableModels?.includes(model)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewPromotion({
                                ...newPromotion,
                                applicableModels: [...(newPromotion.applicableModels || []), model],
                              })
                            } else {
                              setNewPromotion({
                                ...newPromotion,
                                applicableModels: newPromotion.applicableModels?.filter((m) => m !== model),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={model}>{model}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requiresCouponCode"
                      checked={newPromotion.requiresCouponCode}
                      onCheckedChange={(checked) => setNewPromotion({ ...newPromotion, requiresCouponCode: checked })}
                    />
                    <Label htmlFor="requiresCouponCode">Yêu cầu mã giảm giá</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoApply"
                      checked={newPromotion.autoApply}
                      onCheckedChange={(checked) => setNewPromotion({ ...newPromotion, autoApply: checked })}
                    />
                    <Label htmlFor="autoApply">Tự động áp dụng</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Điều khoản</Label>
                  <Textarea
                    id="terms"
                    value={newPromotion.terms}
                    onChange={(e) => setNewPromotion({ ...newPromotion, terms: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddPromotion}>Tạo khuyến mãi</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khuyến mãi</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPromotions}</div>
            <p className="text-xs text-muted-foreground">Tất cả chương trình</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activePromotions}</div>
            <p className="text-xs text-muted-foreground">Chương trình đang chạy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng tiết kiệm</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatPrice(stats.totalSavings)}</div>
            <p className="text-xs text-muted-foreground">Cho khách hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu từ KM</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Từ các chương trình</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tỷ lệ chuyển đổi trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.averageConversionRate}%</div>
            <p className="text-sm text-muted-foreground">Từ lượt xem thành giao dịch</p>
            <Progress value={stats.averageConversionRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cảnh báo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="font-semibold">{stats.expiringThisWeek} chương trình</div>
                <p className="text-sm text-muted-foreground">Sắp hết hạn trong tuần này</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tiêu đề, mô tả, mã giảm giá..."
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
                  : status === "draft"
                    ? "Nháp"
                    : status === "active"
                      ? "Đang chạy"
                      : status === "paused"
                        ? "Tạm dừng"
                        : status === "expired"
                          ? "Hết hạn"
                          : "Đã hủy"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Loại khuyến mãi" />
          </SelectTrigger>
          <SelectContent>
            {promotionTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type === "all"
                  ? "Tất cả loại"
                  : type === "discount"
                    ? "Giảm giá"
                    : type === "cashback"
                      ? "Hoàn tiền"
                      : type === "trade_in"
                        ? "Đổi xe"
                        : type === "financing"
                          ? "Tài chính"
                          : type === "service"
                            ? "Dịch vụ"
                            : "Combo"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Promotions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khuyến mãi</CardTitle>
          <CardDescription>Quản lý chi tiết các chương trình khuyến mãi</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chương trình</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hiệu suất</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{promotion.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{promotion.description}</div>
                      {promotion.requiresCouponCode && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Mã: {promotion.couponCode}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(promotion.type)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{formatDiscount(promotion)}</div>
                    {promotion.minPurchaseAmount && (
                      <div className="text-sm text-muted-foreground">
                        Tối thiểu: {formatPrice(promotion.minPurchaseAmount)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{promotion.startDate}</div>
                      <div className="text-muted-foreground">đến {promotion.endDate}</div>
                      {promotion.status === "active" && (
                        <div className="text-xs mt-1">
                          {getDaysUntilExpiry(promotion.endDate) > 0
                            ? `Còn ${getDaysUntilExpiry(promotion.endDate)} ngày`
                            : "Đã hết hạn"}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(promotion.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Lượt xem:</span>
                        <span>{promotion.analytics.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chuyển đổi:</span>
                        <span>{promotion.analytics.conversions}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Tỷ lệ:</span>
                        <span>{promotion.analytics.conversionRate}%</span>
                      </div>
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
                              setSelectedPromotion(promotion)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết khuyến mãi - {promotion.title}</DialogTitle>
                            <DialogDescription>Thông tin chi tiết và phân tích hiệu suất</DialogDescription>
                          </DialogHeader>
                          {selectedPromotion && (
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">Chi tiết</TabsTrigger>
                                <TabsTrigger value="analytics">Phân tích</TabsTrigger>
                                <TabsTrigger value="usage">Sử dụng</TabsTrigger>
                              </TabsList>
                              <TabsContent value="details" className="space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-3">Thông tin cơ bản</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Tiêu đề:</span>
                                        <span>{selectedPromotion.title}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Loại:</span>
                                        {getTypeBadge(selectedPromotion.type)}
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Giá trị:</span>
                                        <span className="font-semibold">{formatDiscount(selectedPromotion)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Độ ưu tiên:</span>
                                        <span>{selectedPromotion.priority}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-3">Thời gian & Trạng thái</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Bắt đầu:</span>
                                        <span>{selectedPromotion.startDate}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Kết thúc:</span>
                                        <span>{selectedPromotion.endDate}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Trạng thái:</span>
                                        {getStatusBadge(selectedPromotion.status)}
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Tạo bởi:</span>
                                        <span>{selectedPromotion.createdBy}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Mô tả</h4>
                                  <p className="text-sm text-muted-foreground">{selectedPromotion.description}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Model áp dụng</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedPromotion.applicableModels.map((model, index) => (
                                      <Badge key={index} variant="outline">
                                        {model}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Điều khoản</h4>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {selectedPromotion.terms}
                                  </p>
                                </div>
                              </TabsContent>
                              <TabsContent value="analytics" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Lượt xem</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold">{selectedPromotion.analytics.views}</div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Lượt click</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold">{selectedPromotion.analytics.clicks}</div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Chuyển đổi</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold text-green-600">
                                        {selectedPromotion.analytics.conversions}
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Doanh thu</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-lg font-bold">
                                        {formatPrice(selectedPromotion.analytics.revenue)}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Tỷ lệ chuyển đổi</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-3xl font-bold text-blue-600">
                                      {selectedPromotion.analytics.conversionRate}%
                                    </div>
                                    <Progress value={selectedPromotion.analytics.conversionRate} className="mt-2" />
                                  </CardContent>
                                </Card>
                              </TabsContent>
                              <TabsContent value="usage" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Thống kê sử dụng</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Đã sử dụng:</span>
                                        <span className="font-semibold">{selectedPromotion.usageCount}</span>
                                      </div>
                                      {selectedPromotion.usageLimit && (
                                        <div className="flex justify-between">
                                          <span>Giới hạn:</span>
                                          <span>{selectedPromotion.usageLimit}</span>
                                        </div>
                                      )}
                                      {selectedPromotion.perCustomerLimit && (
                                        <div className="flex justify-between">
                                          <span>Mỗi khách hàng:</span>
                                          <span>{selectedPromotion.perCustomerLimit}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Cài đặt</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Tự động áp dụng:</span>
                                        <Badge variant={selectedPromotion.autoApply ? "default" : "secondary"}>
                                          {selectedPromotion.autoApply ? "Có" : "Không"}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Có thể kết hợp:</span>
                                        <Badge variant={selectedPromotion.stackable ? "default" : "secondary"}>
                                          {selectedPromotion.stackable ? "Có" : "Không"}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Yêu cầu mã:</span>
                                        <Badge variant={selectedPromotion.requiresCouponCode ? "default" : "secondary"}>
                                          {selectedPromotion.requiresCouponCode ? "Có" : "Không"}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {selectedPromotion.usageLimit && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Tiến độ sử dụng</h4>
                                    <Progress
                                      value={(selectedPromotion.usageCount / selectedPromotion.usageLimit) * 100}
                                      className="mt-2"
                                    />
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {selectedPromotion.usageCount} / {selectedPromotion.usageLimit} lần sử dụng
                                    </p>
                                  </div>
                                )}
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>

                      {canManagePromotions && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleDuplicatePromotion(promotion)}>
                            <Copy className="h-4 w-4" />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPromotion(promotion)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Chỉnh sửa khuyến mãi</DialogTitle>
                                <DialogDescription>Cập nhật thông tin chương trình khuyến mãi</DialogDescription>
                              </DialogHeader>
                              {selectedPromotion && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-status">Trạng thái</Label>
                                      <Select
                                        value={selectedPromotion.status}
                                        onValueChange={(value: any) =>
                                          setSelectedPromotion({ ...selectedPromotion, status: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="draft">Nháp</SelectItem>
                                          <SelectItem value="active">Đang chạy</SelectItem>
                                          <SelectItem value="paused">Tạm dừng</SelectItem>
                                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-priority">Độ ưu tiên</Label>
                                      <Input
                                        id="edit-priority"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={selectedPromotion.priority}
                                        onChange={(e) =>
                                          setSelectedPromotion({
                                            ...selectedPromotion,
                                            priority: Number(e.target.value),
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-endDate">Ngày kết thúc</Label>
                                      <Input
                                        id="edit-endDate"
                                        type="date"
                                        value={selectedPromotion.endDate}
                                        onChange={(e) =>
                                          setSelectedPromotion({ ...selectedPromotion, endDate: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-usageLimit">Giới hạn sử dụng</Label>
                                      <Input
                                        id="edit-usageLimit"
                                        type="number"
                                        value={selectedPromotion.usageLimit || ""}
                                        onChange={(e) =>
                                          setSelectedPromotion({
                                            ...selectedPromotion,
                                            usageLimit: e.target.value ? Number(e.target.value) : undefined,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Hủy
                                </Button>
                                <Button onClick={handleEditPromotion}>Cập nhật</Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm" onClick={() => handleDeletePromotion(promotion.id)}>
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

      {filteredPromotions.length === 0 && (
        <div className="text-center py-12">
          <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Không tìm thấy khuyến mãi</h3>
          <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  )
}
