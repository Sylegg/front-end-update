"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Car, Phone, User, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface TestDriveBooking {
  id: string
  customerName: string
  phone: string
  email: string
  vehicle: string
  date: string
  time: string
  showroom: string
  notes: string
  status: "scheduled" | "confirmed" | "completed" | "no_show" | "cancelled"
  bookingCode: string
  createdAt: Date
}

const vehicles = {
  vf6: { name: "VF6", type: "Crossover điện", image: "/vinfast-vf6-electric-crossover-red-compact.jpg" },
  vf7: { name: "VF7", type: "SUV điện", image: "/vinfast-vf7-electric-suv-silver-modern.jpg" },
  vf8: { name: "VF8", type: "SUV điện cao cấp", image: "/vinfast-vf8-electric-suv-blue-modern.jpg" },
  vf9: { name: "VF9", type: "SUV điện hạng sang", image: "/vinfast-vf9-electric-suv-white-luxury.jpg" },
}

const showrooms = {
  "hcm-q1": { name: "Showroom Quận 1", address: "123 Nguyễn Huệ, Quận 1, TP.HCM", phone: "028 3822 1234" },
  "hcm-q7": { name: "Showroom Quận 7", address: "456 Nguyễn Thị Thập, Quận 7, TP.HCM", phone: "028 3822 5678" },
  "hcm-thu-duc": { name: "Showroom Thủ Đức", address: "789 Võ Văn Ngân, Thủ Đức, TP.HCM", phone: "028 3822 9012" },
  "hcm-binh-thanh": {
    name: "Showroom Bình Thạnh",
    address: "321 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM",
    phone: "028 3822 3456",
  },
}

export default function TestDriveBookingPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<TestDriveBooking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/test-drives/${params.id}`)
        const data = await response.json()

        if (data.success) {
          setBooking(data.data)
        } else {
          setError("Không tìm thấy thông tin đặt lịch")
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải thông tin")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "no_show":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận"
      case "scheduled":
        return "Đã lên lịch"
      case "completed":
        return "Hoàn thành"
      case "no_show":
        return "Không đến"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-600 mb-2">Không tìm thấy thông tin</h1>
              <p className="text-muted-foreground mb-6">{error || "Thông tin đặt lịch không tồn tại"}</p>
              <Link href="/test-drive">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đặt lịch
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const vehicleInfo = vehicles[booking.vehicle as keyof typeof vehicles]
  const showroomInfo = showrooms[booking.showroom as keyof typeof showrooms]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/test-drive">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Chi tiết đặt lịch lái thử</h1>
            <p className="text-muted-foreground">
              Mã đặt lịch: <span className="font-mono font-bold">{booking.bookingCode}</span>
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Thông tin đặt lịch</CardTitle>
                <Badge className={getStatusColor(booking.status)}>{getStatusLabel(booking.status)}</Badge>
              </div>
              <CardDescription>Đặt lịch ngày {new Date(booking.createdAt).toLocaleDateString("vi-VN")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Thông tin khách hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Họ tên:</span>
                    <span className="font-medium">{booking.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Điện thoại:</span>
                    <span className="font-medium">{booking.phone}</span>
                  </div>
                  {booking.email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{booking.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Schedule Info */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Lịch hẹn
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày:</span>
                    <span className="font-medium">{new Date(booking.date).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giờ:</span>
                    <span className="font-medium">{booking.time}</span>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Ghi chú</h3>
                    <p className="text-sm text-muted-foreground">{booking.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Vehicle & Showroom Info */}
          <div className="space-y-6">
            {/* Vehicle Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Xe lái thử
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <img
                    src={vehicleInfo?.image || "/placeholder.svg"}
                    alt={vehicleInfo?.name}
                    className="w-20 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{vehicleInfo?.name}</h3>
                    <p className="text-muted-foreground">{vehicleInfo?.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Showroom Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Showroom
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold">{showroomInfo?.name}</h3>
                  <p className="text-sm text-muted-foreground">{showroomInfo?.address}</p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>{showroomInfo?.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Hướng dẫn lái thử</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Chuẩn bị trước khi đến:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Mang theo GPLX hạng B1 trở lên (còn hiệu lực)</li>
                  <li>• Mang theo CCCD/CMND</li>
                  <li>• Đến trước giờ hẹn 15 phút</li>
                  <li>• Mặc trang phục phù hợp (giày bệt)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quy trình lái thử:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Check-in tại quầy lễ tân</li>
                  <li>• Tư vấn viên hướng dẫn xe</li>
                  <li>• Lái thử trong 30-45 phút</li>
                  <li>• Tư vấn và báo giá (nếu quan tâm)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 text-center space-x-4">
          <Link href="/test-drive">
            <Button variant="outline">Đặt lịch khác</Button>
          </Link>
          <Button onClick={() => window.print()}>In thông tin</Button>
        </div>
      </div>
    </div>
  )
}
