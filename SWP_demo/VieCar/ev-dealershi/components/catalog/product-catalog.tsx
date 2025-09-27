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
import { Plus, Edit, Trash2, Search, Eye, Star, Zap, Car, Battery } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

interface Product {
  id: string
  name: string
  model: string
  category: string
  price: number
  priceUSD: number
  image: string
  range: number
  acceleration: number
  power: number
  seats: number
  batteryCapacity: number
  chargingTime: string
  topSpeed: number
  drivetrain: string
  warranty: string
  colors: string[]
  features: string[]
  specifications: Record<string, string>
  status: "active" | "inactive" | "discontinued"
  stock: number
  description: string
  createdAt: string
  updatedAt: string
}

const mockProducts: Product[] = [
  {
    id: "vf8",
    name: "VinFast VF 8",
    model: "VF8",
    category: "SUV",
    price: 1291000000,
    priceUSD: 52000,
    image: "/vinfast-vf8-electric-suv-blue-modern.jpg",
    range: 471,
    acceleration: 5.9,
    power: 300,
    seats: 7,
    batteryCapacity: 87.7,
    chargingTime: "31 phút (10-70%)",
    topSpeed: 200,
    drivetrain: "AWD",
    warranty: "10 năm/200,000 km",
    colors: ["Xanh Đại Dương", "Đỏ Ngọc Ruby", "Trắng Ngọc Trai", "Đen Huyền Bí"],
    features: ["Tự lái cấp độ 2", "Màn hình 15.6 inch", "Sạc nhanh DC", "Hệ thống âm thanh cao cấp"],
    specifications: {
      "Kích thước": "4750 x 1934 x 1667 mm",
      "Trọng lượng": "2100 kg",
      "Khoảng sáng gầm": "175 mm",
      "Thể tích cốp": "376L",
      "Loại pin": "LFP",
    },
    status: "active",
    stock: 25,
    description: "SUV điện cao cấp với công nghệ tiên tiến và thiết kế hiện đại",
    createdAt: "2024-01-15",
    updatedAt: "2024-12-20",
  },
  {
    id: "vf9",
    name: "VinFast VF 9",
    model: "VF9",
    category: "SUV",
    price: 1491000000,
    priceUSD: 60000,
    image: "/vinfast-vf9-electric-suv-white-luxury.jpg",
    range: 438,
    acceleration: 6.5,
    power: 300,
    seats: 7,
    batteryCapacity: 123,
    chargingTime: "35 phút (10-70%)",
    topSpeed: 200,
    drivetrain: "AWD",
    warranty: "10 năm/200,000 km",
    colors: ["Trắng Ngọc Trai", "Đen Huyền Bí", "Xám Titan", "Xanh Đại Dương"],
    features: ["Không gian rộng rãi", "Hệ thống âm thanh 13 loa", "Cửa sổ trời toàn cảnh", "Ghế massage"],
    specifications: {
      "Kích thước": "5123 x 1958 x 1736 mm",
      "Trọng lượng": "2400 kg",
      "Khoảng sáng gầm": "185 mm",
      "Thể tích cốp": "423L",
      "Loại pin": "NCM",
    },
    status: "active",
    stock: 18,
    description: "SUV điện hạng sang với không gian rộng rãi và trang bị cao cấp",
    createdAt: "2024-01-15",
    updatedAt: "2024-12-20",
  },
  {
    id: "vf6",
    name: "VinFast VF 6",
    model: "VF6",
    category: "Crossover",
    price: 765000000,
    priceUSD: 31000,
    image: "/vinfast-vf6-electric-crossover-red-compact.jpg",
    range: 388,
    acceleration: 8.0,
    power: 177,
    seats: 5,
    batteryCapacity: 59.6,
    chargingTime: "28 phút (10-70%)",
    topSpeed: 160,
    drivetrain: "FWD",
    warranty: "8 năm/160,000 km",
    colors: ["Đỏ Ngọc Ruby", "Trắng Ngọc Trai", "Xanh Đại Dương", "Đen Huyền Bí"],
    features: ["Thiết kế trẻ trung", "Công nghệ thông minh", "Tiết kiệm năng lượng", "Kết nối smartphone"],
    specifications: {
      "Kích thước": "4238 x 1820 x 1594 mm",
      "Trọng lượng": "1600 kg",
      "Khoảng sáng gầm": "175 mm",
      "Thể tích cốp": "285L",
      "Loại pin": "LFP",
    },
    status: "active",
    stock: 42,
    description: "Crossover điện nhỏ gọn, phù hợp cho đô thị với thiết kế trẻ trung",
    createdAt: "2024-02-01",
    updatedAt: "2024-12-18",
  },
]

export function ProductCatalog() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    model: "",
    category: "SUV",
    price: 0,
    priceUSD: 0,
    image: "",
    range: 0,
    acceleration: 0,
    power: 0,
    seats: 5,
    batteryCapacity: 0,
    chargingTime: "",
    topSpeed: 0,
    drivetrain: "FWD",
    warranty: "",
    colors: [],
    features: [],
    specifications: {},
    status: "active",
    stock: 0,
    description: "",
  })

  const categories = ["all", "SUV", "Crossover", "Sedan", "Hatchback"]
  const statuses = ["all", "active", "inactive", "discontinued"]

  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.model.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((product) => product.status === selectedStatus)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, selectedStatus])

  const handleAddProduct = () => {
    const product: Product = {
      ...(newProduct as Product),
      id: `vf${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setProducts([...products, product])
    setNewProduct({
      name: "",
      model: "",
      category: "SUV",
      price: 0,
      priceUSD: 0,
      image: "",
      range: 0,
      acceleration: 0,
      power: 0,
      seats: 5,
      batteryCapacity: 0,
      chargingTime: "",
      topSpeed: 0,
      drivetrain: "FWD",
      warranty: "",
      colors: [],
      features: [],
      specifications: {},
      status: "active",
      stock: 0,
      description: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = () => {
    if (selectedProduct) {
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id ? { ...selectedProduct, updatedAt: new Date().toISOString().split("T")[0] } : p,
        ),
      )
      setIsEditDialogOpen(false)
      setSelectedProduct(null)
    }
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const canManageProducts = user?.permissions?.includes("manage_catalog") || user?.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Danh mục sản phẩm</h2>
          <p className="text-muted-foreground">Quản lý danh mục xe điện VinFast</p>
        </div>
        {canManageProducts && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                <DialogDescription>Nhập thông tin chi tiết cho sản phẩm mới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên sản phẩm</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={newProduct.model}
                      onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Crossover">Crossover</SelectItem>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                        <SelectItem value="Hatchback">Hatchback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Giá (VND)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priceUSD">Giá (USD)</Label>
                    <Input
                      id="priceUSD"
                      type="number"
                      value={newProduct.priceUSD}
                      onChange={(e) => setNewProduct({ ...newProduct, priceUSD: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="range">Phạm vi (km)</Label>
                    <Input
                      id="range"
                      type="number"
                      value={newProduct.range}
                      onChange={(e) => setNewProduct({ ...newProduct, range: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="power">Công suất (kW)</Label>
                    <Input
                      id="power"
                      type="number"
                      value={newProduct.power}
                      onChange={(e) => setNewProduct({ ...newProduct, power: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seats">Số ghế</Label>
                    <Input
                      id="seats"
                      type="number"
                      value={newProduct.seats}
                      onChange={(e) => setNewProduct({ ...newProduct, seats: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Tồn kho</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddProduct}>Thêm sản phẩm</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "Tất cả danh mục" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                    ? "Đang bán"
                    : status === "inactive"
                      ? "Tạm ngưng"
                      : "Ngưng sản xuất"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Badge
                className={`absolute top-2 right-2 ${
                  product.status === "active"
                    ? "bg-green-500"
                    : product.status === "inactive"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              >
                {product.status === "active"
                  ? "Đang bán"
                  : product.status === "inactive"
                    ? "Tạm ngưng"
                    : "Ngưng sản xuất"}
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <CardDescription className="line-clamp-2">{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
                  <span className="text-sm text-muted-foreground">${product.priceUSD.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-green-500" />
                    <span>{product.range} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span>{product.power} kW</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-500" />
                    <span>{product.seats} chỗ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Tồn: {product.stock}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Xem
                      </Button>
                    </DialogTrigger>
                  </Dialog>

                  {canManageProducts && (
                    <>
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                      </Dialog>

                      <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Product Dialog */}
      {selectedProduct && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>Chi tiết thông tin sản phẩm</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="specs">Thông số</TabsTrigger>
                <TabsTrigger value="features">Tính năng</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Thông tin cơ bản</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Model:</span>
                        <span>{selectedProduct.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Danh mục:</span>
                        <span>{selectedProduct.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Giá:</span>
                        <span>{formatPrice(selectedProduct.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tồn kho:</span>
                        <span>{selectedProduct.stock}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Hiệu suất</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Phạm vi:</span>
                        <span>{selectedProduct.range} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Công suất:</span>
                        <span>{selectedProduct.power} kW</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tăng tốc:</span>
                        <span>{selectedProduct.acceleration}s (0-100km/h)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tốc độ tối đa:</span>
                        <span>{selectedProduct.topSpeed} km/h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="specs" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="features" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Tính năng nổi bật</h4>
                    <ul className="space-y-1">
                      {selectedProduct.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Màu sắc có sẵn</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map((color, index) => (
                        <Badge key={index} variant="outline">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Product Dialog */}
      {selectedProduct && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
              <DialogDescription>Cập nhật thông tin sản phẩm</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Tên sản phẩm</Label>
                  <Input
                    id="edit-name"
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-model">Model</Label>
                  <Input
                    id="edit-model"
                    value={selectedProduct.model}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, model: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Giá (VND)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Tồn kho</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={selectedProduct.stock}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Trạng thái</Label>
                  <Select
                    value={selectedProduct.status}
                    onValueChange={(value: "active" | "inactive" | "discontinued") =>
                      setSelectedProduct({ ...selectedProduct, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang bán</SelectItem>
                      <SelectItem value="inactive">Tạm ngưng</SelectItem>
                      <SelectItem value="discontinued">Ngưng sản xuất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleEditProduct}>Cập nhật</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Không tìm thấy sản phẩm</h3>
          <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  )
}
