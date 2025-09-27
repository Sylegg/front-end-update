import { type NextRequest, NextResponse } from "next/server"

// Mock database - same as in main route
const testDriveBookings = [
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
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const booking = testDriveBookings.find((b) => b.id === params.id)

    if (!booking) {
      return NextResponse.json({ success: false, error: "Test drive booking not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch test drive booking" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const bookingIndex = testDriveBookings.findIndex((b) => b.id === params.id)

    if (bookingIndex === -1) {
      return NextResponse.json({ success: false, error: "Test drive booking not found" }, { status: 404 })
    }

    // Update booking
    testDriveBookings[bookingIndex] = {
      ...testDriveBookings[bookingIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
    }

    return NextResponse.json({
      success: true,
      data: testDriveBookings[bookingIndex],
      message: "Test drive booking updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update test drive booking" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingIndex = testDriveBookings.findIndex((b) => b.id === params.id)

    if (bookingIndex === -1) {
      return NextResponse.json({ success: false, error: "Test drive booking not found" }, { status: 404 })
    }

    testDriveBookings.splice(bookingIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Test drive booking deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete test drive booking" }, { status: 500 })
  }
}
