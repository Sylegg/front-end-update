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
import { Plus, Edit, Trash2, Search, Package, AlertTriangle, TrendingUp, Warehouse, BarChart3 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

interface InventoryItem {
  id: string
  productId: string
  productName: string
  model: string
  vin: string
  color: string
  status: "available" | "reserved" | "sold" | "in_transit" | "maintenance"
  location: string
  dealership: string
  purchasePrice: number
  sellingPrice: number
  arrivalDate: string
  soldDate?: string
  reservedDate?: string
  notes: string
  mileage: number
  condition: "new" | "demo" | "used"
  batteryHealth: number
  lastServiceDate?: string
  warrantyExpiry: string
}

interface InventoryStats {
  totalVehicles: number
  availableVehicles: number
  reservedVehicles: number
  soldThisMonth: number
  lowStockModels: string[]
  averageDaysInInventory: number
  totalValue: number
}

const mockInventory: InventoryItem[] = [
  {
    id: "inv001",
    productId: "vf8",
    productName: "VinFast VF 8",
    model: "VF8",
    vin: "VF8ABC123456789",
    color: "Xanh Đại Dương",
    status: "available",
    location: "Showroom A",
    dealership: "VinFast Hà Nội",
    purchasePrice: 1200000000,
    sellingPrice: 1291000000,
    arrivalDate: "2024-12-01",
    notes: "Xe mới, chưa qua sử dụng",
    mileage: 0,
    condition: "new",
    batteryHealth: 100,
    warrantyExpiry: "2034-12-01",
  },
  {
    id: "inv002",
    productId: "vf9",
    productName: "VinFast VF 9",
    model: "VF9",
    vin: "VF9DEF123456789",
    color: "Trắng Ngọc Trai",
    status: "reserved",
    location: "Showroom B",
    dealership: "VinFast TP.HCM",
    purchasePrice: 1400000000,
    sellingPrice: 1491000000,
    arrivalDate: "2024-11-15",
    reservedDate: "2024-12-18",
    notes: "Đã đặt cọc, chờ giao xe",
    mileage: 50,
    condition: "demo",
    batteryHealth: 98,
    warrantyExpiry: "2034-11-15",
  },
  {
    id: "inv003",
    productId: "vf6",
    productName: "VinFast VF 6",
    model: "VF6",
    vin: "VF6GHI123456789",
    color: "Đỏ Ngọc Ruby",
    status: "sold",
    location: "Kho chính",
    dealership: "VinFast Đà Nẵng",
    purchasePrice: 700000000,
    sellingPrice: 765000000,
    arrivalDate: "2024-10-20",
    soldDate: "2024-12-10",
    notes: "Đã bán và giao xe",
    mileage: 0,
    condition: "new",
    batteryHealth: 100,
    warrantyExpiry: "2032-10-20",
  },
  {
    id: "inv004",
    productId: "vf7",
    productName: "VinFast VF 7",
    model: "VF7",
    vin: "VF7JKL123456789",
    color: "Xám Titan",
    status: "in_transit",
    location: "Đang vận chuyển",
    dealership: "VinFast Hải Phòng",
    purchasePrice: 950000000,
    sellingPrice: 999000000,
    arrivalDate: "2024-12-25",
    notes: "Đang trên đường vận chuyển từ nhà máy",
    mileage: 0,
    condition: "new",
    batteryHealth: 100,
    warrantyExpiry: "2034-12-25",
  },
]

const mockStats: InventoryStats = {
  totalVehicles: 156,
  availableVehicles: 89,
  reservedVehicles: 23,
  soldThisMonth: 44,
  lowStockModels: ["VF 6", "VF 7"],
  averageDaysInInventory: 45,
  totalValue: 18500000000,
}

export function InventoryManagement() {
  const { user } = useAuth()
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(mockInventory)
  const [stats, setStats] = useState<InventoryStats>(mockStats)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    productName: "",
    model: "",
    vin: "",
    color: "",
    status: "available",
    location: "",
    dealership: "",
    purchasePrice: 0,
    sellingPrice: 0,
    arrivalDate: "",
    notes: "",
    mileage: 0,
    condition: "new",
    batteryHealth: 100,
    warrantyExpiry: "",
  })

  const statuses = ["all", "available", "reserved", "sold", "in_transit", "maintenance"]
  const locations = ["all", "Showroom A", "Showroom B", "Kho chính", "Đang vận chuyển"]
  const conditions = ["new", "demo", "used"]

  useEffect(() => {
    let filtered = inventory

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.model.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus)
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter((item) => item.location === selectedLocation)
    }

    setFilteredInventory(filtered)
  }, [inventory, searchTerm, selectedStatus, selectedLocation])

  const handleAddItem = () => {
    const item: InventoryItem = {
      ...(newItem as InventoryItem),
      id: `inv${Date.now()}`,
      productId: newItem.model?.toLowerCase() || "",
    }
    setInventory([...inventory, item])
    setNewItem({
      productName: "",
      model: "",
      vin: "",
      color: "",
      status: "available",
      location: "",
      dealership: "",
      purchasePrice: 0,
      sellingPrice: 0,
      arrivalDate: "",
      notes: "",
      mileage: 0,
      condition: "new",
      batteryHealth: 100,
      warrantyExpiry: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditItem = () => {
    if (selectedItem) {
      setInventory(inventory.map((item) => (item.id === selectedItem.id ? selectedItem : item)))
      setIsEditDialogOpen(false)
      setSelectedItem(null)
    }
  }

  const handleDeleteItem = (itemId: string) => {
    setInventory(inventory.filter((item) => item.id !== itemId))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: "Có sẵn", className: "bg-green-500" },
      reserved: { label: "Đã đặt", className: "bg-yellow-500" },
      sold: { label: "Đã bán", className: "bg-blue-500" },
      in_transit: { label: "Đang chuyển", className: "bg-purple-500" },
      maintenance: { label: "Bảo trì", className: "bg-red-500" },
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

  const canManageInventory = user?.permissions?.includes("manage_inventory") || user?.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý tồn kho</h2>
          <p className="text-muted-foreground">Theo dõi và quản lý tồn kho xe điện</p>
        </div>
        {canManageInventory && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm xe vào kho
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm xe vào tồn kho</DialogTitle>
                <DialogDescription>Nhập thông tin chi tiết cho xe mới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Tên sản phẩm</Label>
                    <Input
                      id="productName"
                      value={newItem.productName}
                      onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Select value={newItem.model} onValueChange={(value) => setNewItem({ ...newItem, model: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VF6">VF 6</SelectItem>
                        <SelectItem value="VF7">VF 7</SelectItem>
                        <SelectItem value="VF8">VF 8</SelectItem>
                        <SelectItem value="VF9">VF 9</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vin">VIN</Label>
                    <Input
                      id="vin"
                      value={newItem.vin}
                      onChange={(e) => setNewItem({ ...newItem, vin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Màu sắc</Label>
                    <Input
                      id="color"
                      value={newItem.color}
                      onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">Tình trạng</Label>
                    <Select
                      value={newItem.condition}
                      onValueChange={(value: "new" | "demo" | "used") => setNewItem({ ...newItem, condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Mới</SelectItem>
                        <SelectItem value="demo">Demo</SelectItem>
                        <SelectItem value="used">Đã qua sử dụng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Vị trí</Label>
                    <Input
                      id="location"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dealership">Đại lý</Label>
                    <Input
                      id="dealership"
                      value={newItem.dealership}
                      onChange={(e) => setNewItem({ ...newItem, dealership: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Giá mua vào</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      value={newItem.purchasePrice}
                      onChange={(e) => setNewItem({ ...newItem, purchasePrice: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">Giá bán</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      value={newItem.sellingPrice}
                      onChange={(e) => setNewItem({ ...newItem, sellingPrice: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddItem}>Thêm vào kho</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số xe</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">Tất cả xe trong hệ thống</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Xe có sẵn</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.availableVehicles}</div>
            <p className="text-xs text-muted-foreground">Sẵn sàng bán</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã bán tháng này</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.soldThisMonth}</div>
            <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giá trị tồn kho</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">Tổng giá trị</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockModels.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Cảnh báo tồn kho thấp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">Các model sau đang có tồn kho thấp: {stats.lowStockModels.join(", ")}</p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên, VIN, model..."
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
                  : status === "available"
                    ? "Có sẵn"
                    : status === "reserved"
                      ? "Đã đặt"
                      : status === "sold"
                        ? "Đã bán"
                        : status === "in_transit"
                          ? "Đang chuyển"
                          : "Bảo trì"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vị trí" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location === "all" ? "Tất cả vị trí" : location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tồn kho</CardTitle>
          <CardDescription>Quản lý chi tiết từng xe trong tồn kho</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>VIN</TableHead>
                <TableHead>Màu sắc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Giá bán</TableHead>
                <TableHead>Tình trạng</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-muted-foreground">{item.model}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.vin}</TableCell>
                  <TableCell>{item.color}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{formatPrice(item.sellingPrice)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.condition === "new" ? "Mới" : item.condition === "demo" ? "Demo" : "Đã qua sử dụng"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            Xem
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Chi tiết xe - {item.productName}</DialogTitle>
                            <DialogDescription>Thông tin chi tiết về xe trong tồn kho</DialogDescription>
                          </DialogHeader>
                          {selectedItem && (
                            <Tabs defaultValue="basic" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="basic">Cơ bản</TabsTrigger>
                                <TabsTrigger value="financial">Tài chính</TabsTrigger>
                                <TabsTrigger value="technical">Kỹ thuật</TabsTrigger>
                              </TabsList>
                              <TabsContent value="basic" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">VIN</Label>
                                    <p className="font-mono">{selectedItem.vin}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Màu sắc</Label>
                                    <p>{selectedItem.color}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Vị trí</Label>
                                    <p>{selectedItem.location}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Đại lý</Label>
                                    <p>{selectedItem.dealership}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Ngày nhập</Label>
                                    <p>{selectedItem.arrivalDate}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Trạng thái</Label>
                                    <p>{getStatusBadge(selectedItem.status)}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Ghi chú</Label>
                                  <p className="text-sm text-muted-foreground">{selectedItem.notes}</p>
                                </div>
                              </TabsContent>
                              <TabsContent value="financial" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Giá mua vào</Label>
                                    <p className="text-lg font-semibold">{formatPrice(selectedItem.purchasePrice)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Giá bán</Label>
                                    <p className="text-lg font-semibold text-green-600">
                                      {formatPrice(selectedItem.sellingPrice)}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Lợi nhuận dự kiến</Label>
                                    <p className="text-lg font-semibold text-blue-600">
                                      {formatPrice(selectedItem.sellingPrice - selectedItem.purchasePrice)}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Tỷ suất lợi nhuận</Label>
                                    <p className="text-lg font-semibold">
                                      {(
                                        ((selectedItem.sellingPrice - selectedItem.purchasePrice) /
                                          selectedItem.purchasePrice) *
                                        100
                                      ).toFixed(1)}
                                      %
                                    </p>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="technical" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Số km đã đi</Label>
                                    <p>{selectedItem.mileage.toLocaleString()} km</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Tình trạng</Label>
                                    <p>
                                      {selectedItem.condition === "new"
                                        ? "Mới"
                                        : selectedItem.condition === "demo"
                                          ? "Demo"
                                          : "Đã qua sử dụng"}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Sức khỏe pin</Label>
                                    <p className="flex items-center gap-2">
                                      {selectedItem.batteryHealth}%
                                      <Badge
                                        variant={selectedItem.batteryHealth >= 90 ? "default" : "destructive"}
                                        className="text-xs"
                                      >
                                        {selectedItem.batteryHealth >= 90 ? "Tốt" : "Cần kiểm tra"}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Hết hạn bảo hành</Label>
                                    <p>{selectedItem.warrantyExpiry}</p>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>

                      {canManageInventory && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item)
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Chỉnh sửa thông tin xe</DialogTitle>
                                <DialogDescription>Cập nhật thông tin xe trong tồn kho</DialogDescription>
                              </DialogHeader>
                              {selectedItem && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-status">Trạng thái</Label>
                                      <Select
                                        value={selectedItem.status}
                                        onValueChange={(value: any) =>
                                          setSelectedItem({ ...selectedItem, status: value })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="available">Có sẵn</SelectItem>
                                          <SelectItem value="reserved">Đã đặt</SelectItem>
                                          <SelectItem value="sold">Đã bán</SelectItem>
                                          <SelectItem value="in_transit">Đang chuyển</SelectItem>
                                          <SelectItem value="maintenance">Bảo trì</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-location">Vị trí</Label>
                                      <Input
                                        id="edit-location"
                                        value={selectedItem.location}
                                        onChange={(e) => setSelectedItem({ ...selectedItem, location: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-sellingPrice">Giá bán</Label>
                                      <Input
                                        id="edit-sellingPrice"
                                        type="number"
                                        value={selectedItem.sellingPrice}
                                        onChange={(e) =>
                                          setSelectedItem({ ...selectedItem, sellingPrice: Number(e.target.value) })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-batteryHealth">Sức khỏe pin (%)</Label>
                                      <Input
                                        id="edit-batteryHealth"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={selectedItem.batteryHealth}
                                        onChange={(e) =>
                                          setSelectedItem({ ...selectedItem, batteryHealth: Number(e.target.value) })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-notes">Ghi chú</Label>
                                    <Textarea
                                      id="edit-notes"
                                      value={selectedItem.notes}
                                      onChange={(e) => setSelectedItem({ ...selectedItem, notes: e.target.value })}
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Hủy
                                </Button>
                                <Button onClick={handleEditItem}>Cập nhật</Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)}>
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

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Không tìm thấy xe nào</h3>
          <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  )
}
