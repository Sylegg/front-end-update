"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"

interface TestDriveBooking {
  id: string
  customerName: string
  vehicle: string
  time: string
  status: "scheduled" | "confirmed" | "completed" | "no_show" | "cancelled"
  bookingCode: string
}

interface CalendarDay {
  date: Date
  bookings: TestDriveBooking[]
  isCurrentMonth: boolean
  isToday: boolean
}

export function TestDriveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Mock data - in real app, fetch from API
  const mockBookings: TestDriveBooking[] = [
    {
      id: "1",
      customerName: "Nguyễn Văn A",
      vehicle: "VF8",
      time: "10:00",
      status: "confirmed",
      bookingCode: "VF240125001",
    },
    {
      id: "2",
      customerName: "Trần Thị B",
      vehicle: "VF9",
      time: "14:30",
      status: "scheduled",
      bookingCode: "VF240126002",
    },
  ]

  useEffect(() => {
    generateCalendar()
  }, [currentDate])

  const generateCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days: CalendarDay[] = []
    const today = new Date()

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const dayBookings = mockBookings.filter((booking) => {
        // Mock: assign bookings to specific dates
        return date.getDate() === 25 || date.getDate() === 26
      })

      days.push({
        date,
        bookings: dayBookings,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
      })
    }

    setCalendarDays(days)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
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

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Lịch lái thử
              </CardTitle>
              <CardDescription>Xem lịch đặt lái thử theo ngày</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold min-w-[120px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`
                  min-h-[80px] p-2 border rounded cursor-pointer transition-colors
                  ${day.isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50 text-gray-400"}
                  ${day.isToday ? "ring-2 ring-blue-500" : ""}
                  ${selectedDate?.toDateString() === day.date.toDateString() ? "bg-blue-50" : ""}
                `}
                onClick={() => setSelectedDate(day.date)}
              >
                <div className="text-sm font-medium mb-1">{day.date.getDate()}</div>
                <div className="space-y-1">
                  {day.bookings.slice(0, 2).map((booking) => (
                    <div key={booking.id} className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate">
                      {booking.time} - {booking.vehicle}
                    </div>
                  ))}
                  {day.bookings.length > 2 && (
                    <div className="text-xs text-muted-foreground">+{day.bookings.length - 2} khác</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Lịch ngày {selectedDate.toLocaleDateString("vi-VN")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {calendarDays.find((day) => day.date.toDateString() === selectedDate.toDateString())?.bookings.length ? (
              <div className="space-y-3">
                {calendarDays
                  .find((day) => day.date.toDateString() === selectedDate.toDateString())
                  ?.bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium">{booking.time}</div>
                        <div>
                          <div className="font-medium">{booking.customerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {booking.vehicle} - {booking.bookingCode}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status === "scheduled" && "Đã lên lịch"}
                        {booking.status === "confirmed" && "Đã xác nhận"}
                        {booking.status === "completed" && "Hoàn thành"}
                        {booking.status === "no_show" && "Không đến"}
                        {booking.status === "cancelled" && "Đã hủy"}
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Không có lịch lái thử nào trong ngày này</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
