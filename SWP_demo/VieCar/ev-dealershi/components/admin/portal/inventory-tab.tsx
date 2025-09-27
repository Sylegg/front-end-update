"use client"
import { useMemo, useState } from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Edit, Eye, Plus, Trash2, Upload } from "lucide-react"
import { inventoryData } from "./data"
import { formatCurrencyVND } from "./utils"

export function InventoryTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedInventory, setSelectedInventory] = useState<(typeof inventoryData)[0] | null>(null)

  const filteredInventory = useMemo(() => inventoryData.filter((item) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch = item.model.toLowerCase().includes(q) || item.vin.toLowerCase().includes(q) || item.color.toLowerCase().includes(q)
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  }), [searchTerm, statusFilter])

  const getStatusBadge = (status: string) => {
    const map: Record<string, {label: string, className: string}> = {
      available: { label: "Có sẵn", className: "bg-green-100 text-green-800" },
      reserved: { label: "Đã đặt cọc", className: "bg-yellow-100 text-yellow-800" },
      sold: { label: "Đã bán", className: "bg-blue-100 text-blue-800" },
      maintenance: { label: "Bảo trì", className: "bg-red-100 text-red-800" },
    }
    const cfg = map[status] || { label: status, className: "" }
    return <Badge className={cfg.className}>{cfg.label}</Badge>
  }

  return (
    <TabsContent value="inventory" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý kho xe</h2>
        <div className="flex space-x-2">
          <Button><Plus className="mr-2 h-4 w-4"/>Thêm xe mới</Button>
          <Button variant="outline"><Upload className="mr-2 h-4 w-4"/>Import</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Export</Button>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <Input placeholder="Tìm kiếm theo model, VIN, màu sắc..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm"/>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Lọc theo trạng thái"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="available">Có sẵn</SelectItem>
            <SelectItem value="reserved">Đã đặt cọc</SelectItem>
            <SelectItem value="sold">Đã bán</SelectItem>
            <SelectItem value="maintenance">Bảo trì</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Model</th>
                  <th className="text-left p-4 font-medium">VIN</th>
                  <th className="text-left p-4 font-medium">Màu sắc</th>
                  <th className="text-left p-4 font-medium">Vị trí</th>
                  <th className="text-left p-4 font-medium">Giá</th>
                  <th className="text-left p-4 font-medium">Trạng thái</th>
                  <th className="text-left p-4 font-medium">Ngày nhập</th>
                  <th className="text-left p-4 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{item.model}</td>
                    <td className="p-4 font-mono text-sm">{item.vin}</td>
                    <td className="p-4">{item.color}</td>
                    <td className="p-4">{item.location}</td>
                    <td className="p-4 font-medium">{formatCurrencyVND(item.price).slice(0, -4)}M</td>
                    <td className="p-4">{getStatusBadge(item.status)}</td>
                    <td className="p-4">{item.importDate}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedInventory(item)}><Eye className="h-4 w-4"/></Button>
                        <Button size="sm" variant="outline"><Edit className="h-4 w-4"/></Button>
                        <Button size="sm" variant="outline"><Trash2 className="h-4 w-4"/></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
