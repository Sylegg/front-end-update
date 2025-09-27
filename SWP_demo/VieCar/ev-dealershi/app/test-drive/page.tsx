"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Car, Phone, Mail, User, CheckCircle } from "lucide-react"

const vehicles = [
  {
    id: "vf6",
    name: "VF6",
    type: "Crossover điện",
    price: "Từ 765 triệu VNĐ",
    image: "/vinfast-vf6-electric-crossover-red-compact.jpg",
    features: ["Phạm vi 445km", "Sạc nhanh 10-70% trong 31 phút", "Công nghệ AI thông minh"],
  },
  {
    id: "vf7",
    name: "VF7",
    type: "SUV điện",
    price: "Từ 850 triệu VNĐ",
    image: "/vinfast-vf7-electric-suv-silver-modern.jpg",
    features: ["Phạm vi 450km", "Sạc nhanh 10-70% trong 35 phút", "Hệ thống ADAS tiên tiến"],
  },
  {
    id: "vf8",
    name: "VF8",
    type: "SUV điện cao cấp",
    price: "Từ 1.2 tỷ VNĐ",
    image: "/vinfast-vf8-electric-suv-blue-modern.jpg",
    features: ["Phạm vi 471km", "Sạc nhanh 10-70% trong 31 phút", "Nội thất sang trọng"],
  },
  {
    id: "vf9",
    name: "VF9",
    type: "SUV điện hạng sang",
    price: "Từ 1.5 tỷ VNĐ",
    image: "/vinfast-vf9-electric-suv-white-luxury.jpg",
    features: ["Phạm vi 438km", "Sạc nhanh 10-70% trong 35 phút", "7 chỗ ngồi rộng rãi"],
  },
]

const showrooms = [
  { id: "hcm-q1", name: "Showroom Quận 1", address: "123 Nguyễn Huệ, Quận 1, TP.HCM" },
  { id: "hcm-q7", name: "Showroom Quận 7", address: "456 Nguyễn Thị Thập, Quận 7, TP.HCM" },
  { id: "hcm-thu-duc", name: "Showroom Thủ Đức", address: "789 Võ Văn Ngân, Thủ Đức, TP.HCM" },
  { id: "hcm-binh-thanh", name: "Showroom Bình Thạnh", address: "321 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM" },
]

const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]

export default function TestDrivePage() {
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    showroom: "",
    date: "",
    time: "",
    notes: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [bookingCode, setBookingCode] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Generate booking code
    const code = `VF${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setBookingCode(code)
    setIsSubmitted(true)
  }

  const selectedVehicleData = vehicles.find((v) => v.id === selectedVehicle)

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-green-600 mb-2">Đặt lịch thành công!</h1>
                <p className="text-muted-foreground">Cảm ơn bạn đã đăng ký lái thử VinFast</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-4">Thông tin đặt lịch</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Mã đặt lịch:</span>
                    <span className="font-mono font-bold">{bookingCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Xe lái thử:</span>
                    <span className="font-semibold">{selectedVehicleData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ngày giờ:</span>
                    <span>
                      {new Date(formData.date).toLocaleDateString("vi-VN")} - {formData.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Showroom:</span>
                    <span>{showrooms.find((s) => s.id === formData.showroom)?.name}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-6">
                <p>Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận lịch hẹn.</p>
                <p>Vui lòng mang theo GPLX và CCCD khi đến lái thử.</p>
              </div>

              <Button
                onClick={() => {
                  setIsSubmitted(false)
                  setSelectedVehicle("")
                  setFormData({
                    fullName: "",
                    phone: "",
                    email: "",
                    showroom: "",
                    date: "",
                    time: "",
                    notes: "",
                  })
                }}
              >
                Đặt lịch khác
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Trải nghiệm lái thử VinFast</h1>
          <p className="text-xl opacity-90 mb-8">Khám phá cảm giác lái xe điện thông minh, thân thiện môi trường</p>
          <div className="flex justify-center items-center space-x-8 text-sm">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>Đặt lịch dễ dàng</span>
            </div>
            <div className="flex items-center">
              <Car className="h-5 w-5 mr-2" />
              <span>Đa dạng mẫu xe</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>Nhiều showroom</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Vehicle Selection */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Chọn xe lái thử</h2>
            <div className="grid gap-4">
              {vehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className={`cursor-pointer transition-all ${
                    selectedVehicle === vehicle.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.name}
                        className="w-20 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-lg">{vehicle.name}</h3>
                          <Badge variant="secondary">{vehicle.type}</Badge>
                        </div>
                        <p className="text-blue-600 font-semibold mb-2">{vehicle.price}</p>
                        <div className="text-sm text-muted-foreground">
                          {vehicle.features.map((feature, index) => (
                            <span key={index}>
                              {feature}
                              {index < vehicle.features.length - 1 && " • "}
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedVehicle === vehicle.id && <CheckCircle className="h-6 w-6 text-blue-500" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Thông tin đặt lịch
                </CardTitle>
                <CardDescription>Vui lòng điền đầy đủ thông tin để đặt lịch lái thử</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        <User className="h-4 w-4 inline mr-1" />
                        Họ và tên *
                      </Label>
                      <Input
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Số điện thoại *
                      </Label>
                      <Input
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0901234567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="showroom">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Showroom *
                    </Label>
                    <Select
                      required
                      value={formData.showroom}
                      onValueChange={(value) => setFormData({ ...formData, showroom: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn showroom" />
                      </SelectTrigger>
                      <SelectContent>
                        {showrooms.map((showroom) => (
                          <SelectItem key={showroom.id} value={showroom.id}>
                            <div>
                              <div className="font-medium">{showroom.name}</div>
                              <div className="text-sm text-muted-foreground">{showroom.address}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Ngày *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Giờ *
                      </Label>
                      <Select
                        required
                        value={formData.time}
                        onValueChange={(value) => setFormData({ ...formData, time: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giờ" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Thông tin bổ sung (kinh nghiệm lái xe, yêu cầu đặc biệt...)"
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={!selectedVehicle}>
                    {selectedVehicle ? `Đặt lịch lái thử ${selectedVehicleData?.name}` : "Vui lòng chọn xe"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
