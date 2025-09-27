"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { RoleGuard } from "@/components/auth/role-guard"
import { Package, AlertTriangle, Truck } from "lucide-react"

interface InventoryItem {
  id: string
  model: string
  variant: string
  color: string
  vin: string
  status: "available" | "reserved" | "sold" | "in_transit" | "maintenance"
  location: string
  arrivalDate?: Date
  reservedFor?: string
  price: number
  createdAt: Date
}

// Mock inventory data
const mockInventory: InventoryItem[] = [
  {
    id: "1",
    model: "VF8",
    variant: "Plus",
    color: "Xanh Ocean",
    vin: "VF8P2025001234567",
    status: "available",
    location: "Showroom Quận 1",
    price: 1291000000,
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    model: "VF8",
    variant: "Eco",
    color: "Trắng Pearl",
    vin: "VF8E2025001234568",
    status: "reserved",
    location: "Showroom Quận 1",
    reservedFor: "Nguyễn Văn A",
    price: 1091000000,
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "3",
    model: "VF9",
    variant: "Plus",
    color: "Đen Obsidian",
    vin: "VF9P2025001234569",
    status: "in_transit",
    location: "Đang vận chuyển",
    arrivalDate: new Date("2025-01-28"),
    price: 1491000000,
    createdAt: new Date("2025-01-20"),
  },
  {
    id: "4",
    model: "VF6",
    variant: "Plus",
    color: "Đỏ Ruby",
    vin: "VF6P2025001234570",
    status: "available",
    location: "Showroom Quận 7",
    price: 765000000,
    createdAt: new Date("2025-01-12"),
  },
  {
    id: "5",
    model: "VF7",
    variant: "Plus",
    color: "Xám Titanium",
    vin: "VF7P2025001234571",
    status: "sold",
    location: "Đã giao",
    price: 999000000,
    createdAt: new Date("2025-01-08"),
  },
]

export function InventoryView() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [filterModel, setFilterModel] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterLocation, setFilterLocation] = useState<string>("all")

  const getStatusLabel = (status: string) => {
    const labels = {
      available: "Có sẵn",
      reserved: "Đã đặt cọc",
      sold: "Đã bán",
      in_transit: "Đang vận chuyển",
      maintenance: "Bảo trì",
    }
    return labels[status as keyof typeof labels] || status
  }

  const getStatusColor = (status: string) => {
    const colors = {
      available: "bg-green-500",
      reserved: "bg-yellow-500",
      sold: "bg-blue-500",
      in_transit: "bg-purple-500",
      maintenance: "bg-red-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const inventoryColumns = [
    {
      key: "model" as const,
      label: "Mẫu xe",
      sortable: true,
    },
    {
      key: "variant" as const,
      label: "Phiên bản",
      sortable: true,
    },
    {
      key: "color" as const,
      label: "Màu sắc",
      sortable: true,
    },
    {
      key: "vin" as const,
      label: "VIN",
      sortable: true,
      render: (value: string) => <span className="font-mono text-xs">{value}</span>,
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
      key: "location" as const,
      label: "Vị trí",
      sortable: true,
    },
    {
      key: "price" as const,
      label: "Giá bán",
      sortable: true,
      render: (value: number) => <span className="font-medium">{(value / 1000000).toFixed(0)}M VND</span>,
    },
    {
      key: "reservedFor" as const,
      label: "Đặt cho",
      render: (value: string) => value || "-",
    },
  ]

  const inventoryActions = (item: InventoryItem) => (
    <div className="flex items-center space-x-2">
      {item.status === "available" && (
        <Button variant="ghost" size="sm">
          Đặt cọc
        </Button>
      )}
      {item.status === "reserved" && (
        <Button variant="ghost" size="sm">
          Giao xe
        </Button>
      )}
      <Button variant="ghost" size="sm">
        Chi tiết
      </Button>
    </div>
  )

  // Filter inventory based on selected filters
  const filteredInventory = inventory.filter((item) => {
    if (filterModel !== "all" && item.model !== filterModel) return false
    if (filterStatus !== "all" && item.status !== filterStatus) return false
    if (filterLocation !== "all" && item.location !== filterLocation) return false
    return true
  })

  // Calculate inventory stats
  const inventoryStats = {
    total: inventory.length,
    available: inventory.filter((item) => item.status === "available").length,
    reserved: inventory.filter((item) => item.status === "reserved").length,
    inTransit: inventory.filter((item) => item.status === "in_transit").length,
    lowStock: 3, // Mock low stock count
  }

  return (
    <RoleGuard permissions={["inventory.read"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tồn kho xe</h2>
            <p className="text-muted-foreground">Theo dõi và quản lý xe trong kho</p>
          </div>
          <RoleGuard permissions={["inventory.manage"]}>
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Yêu cầu nhập xe
            </Button>
          </RoleGuard>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng xe</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryStats.total}</div>
              <p className="text-xs text-muted-foreground">Tất cả xe trong hệ thống</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Có sẵn</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{inventoryStats.available}</div>
              <p className="text-xs text-muted-foreground">Sẵn sàng bán</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã đặt cọc</CardTitle>
              <Package className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{inventoryStats.reserved}</div>
              <p className="text-xs text-muted-foreground">Chờ giao xe</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang về</CardTitle>
              <Truck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{inventoryStats.inTransit}</div>
              <p className="text-xs text-muted-foreground">Đang vận chuyển</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tồn kho thấp</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{inventoryStats.lowStock}</div>
              <p className="text-xs text-muted-foreground">Cần nhập thêm</p>
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
                <label className="text-sm font-medium">Mẫu xe</label>
                <Select value={filterModel} onValueChange={setFilterModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="VF6">VF6</SelectItem>
                    <SelectItem value="VF7">VF7</SelectItem>
                    <SelectItem value="VF8">VF8</SelectItem>
                    <SelectItem value="VF9">VF9</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Trạng thái</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="available">Có sẵn</SelectItem>
                    <SelectItem value="reserved">Đã đặt cọc</SelectItem>
                    <SelectItem value="sold">Đã bán</SelectItem>
                    <SelectItem value="in_transit">Đang vận chuyển</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Vị trí</label>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Showroom Quận 1">Showroom Quận 1</SelectItem>
                    <SelectItem value="Showroom Quận 7">Showroom Quận 7</SelectItem>
                    <SelectItem value="Showroom Thủ Đức">Showroom Thủ Đức</SelectItem>
                    <SelectItem value="Showroom Bình Thạnh">Showroom Bình Thạnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tìm kiếm VIN</label>
                <Input placeholder="Nhập VIN..." />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách xe</CardTitle>
            <CardDescription>
              Hiển thị {filteredInventory.length} / {inventory.length} xe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredInventory}
              columns={inventoryColumns}
              actions={inventoryActions}
              searchable={true}
              exportable={true}
              pageSize={15}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}
