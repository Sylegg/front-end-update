import { type NextRequest, NextResponse } from "next/server"

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

// Mock database - in real app, this would be a proper database
const testDriveBookings: TestDriveBooking[] = [
  {
    id: "1",
    customerName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@email.com",
    vehicle: "vf8",
    date: "2025-01-25",
    time: "10:00",
    status: "confirmed",
    showroom: "hcm-q1",
    bookingCode: "VF240125001",
    notes: "Khách hàng có kinh nghiệm lái xe tự động",
    createdAt: new Date("2025-01-20"),
  },
  {
    id: "2",
    customerName: "Trần Thị B",
    phone: "0912345678",
    email: "tranthib@email.com",
    vehicle: "vf9",
    date: "2025-01-26",
    time: "14:30",
    status: "scheduled",
    showroom: "hcm-q7",
    bookingCode: "VF240126002",
    notes: "Lần đầu lái xe điện",
    createdAt: new Date("2025-01-21"),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const showroom = searchParams.get("showroom")

    let filteredBookings = testDriveBookings

    if (status) {
      filteredBookings = filteredBookings.filter((booking) => booking.status === status)
    }

    if (showroom) {
      filteredBookings = filteredBookings.filter((booking) => booking.showroom === showroom)
    }

    return NextResponse.json({
      success: true,
      data: filteredBookings,
      total: filteredBookings.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch test drive bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["customerName", "phone", "vehicle", "date", "time", "showroom"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Generate booking code
    const bookingCode = `VF${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}${String(testDriveBookings.length + 1).padStart(3, "0")}`

    // Create new booking
    const newBooking: TestDriveBooking = {
      id: Date.now().toString(),
      customerName: body.customerName,
      phone: body.phone,
      email: body.email || "",
      vehicle: body.vehicle,
      date: body.date,
      time: body.time,
      showroom: body.showroom,
      notes: body.notes || "",
      status: "scheduled",
      bookingCode,
      createdAt: new Date(),
    }

    testDriveBookings.push(newBooking)

    return NextResponse.json(
      {
        success: true,
        data: newBooking,
        message: "Test drive booking created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create test drive booking" }, { status: 500 })
  }
}
