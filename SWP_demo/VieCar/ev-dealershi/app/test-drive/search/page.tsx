"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, MapPin, Car, Phone, Mail, AlertCircle } from "lucide-react"
import Link from "next/link"

interface SearchResult {
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
}

// Mock search results
const mockResults: SearchResult[] = [
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
  },
]

export default function TestDriveSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setHasSearched(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock search logic
    const results = mockResults.filter(
      (result) =>
        result.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.phone.includes(searchQuery) ||
        result.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setSearchResults(results)
    setIsSearching(false)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-purple-100 text-purple-800",
      no_show: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Tra cứu lịch lái thử</h1>
          <p className="text-muted-foreground">Nhập mã đặt lịch, số điện thoại hoặc tên để tra cứu thông tin lái thử</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Tìm kiếm
            </CardTitle>
            <CardDescription>
              Bạn có thể tìm kiếm bằng mã đặt lịch (VF...), số điện thoại hoặc tên khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="search">Thông tin tìm kiếm</Label>
                <Input
                  id="search"
                  placeholder="Nhập mã đặt lịch, số điện thoại hoặc tên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <Card>
            <CardHeader>
              <CardTitle>Kết quả tìm kiếm</CardTitle>
              <CardDescription>
                {isSearching ? "Đang tìm kiếm..." : `Tìm thấy ${searchResults.length} kết quả cho "${searchQuery}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSearching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>Đang tìm kiếm...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{result.customerName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Mã đặt lịch: <span className="font-mono font-medium">{result.bookingCode}</span>
                          </p>
                        </div>
                        <Badge className={getStatusColor(result.status)}>{getStatusLabel(result.status)}</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{result.phone}</span>
                          </div>
                          {result.email && (
                            <div className="flex items-center text-sm">
                              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{result.email}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{result.vehicle}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {new Date(result.date).toLocaleDateString("vi-VN")} - {result.time}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{result.showroom}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Link href={`/test-drive/booking/${result.id}`}>
                          <Button variant="outline" size="sm">
                            Xem chi tiết
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Không tìm thấy kết quả</h3>
                  <p className="text-muted-foreground mb-4">
                    Không tìm thấy lịch lái thử nào với thông tin "{searchQuery}"
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vui lòng kiểm tra lại thông tin hoặc liên hệ hotline để được hỗ trợ
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center space-x-4">
          <Link href="/test-drive">
            <Button variant="outline">Đặt lịch mới</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost">Về trang chủ</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
