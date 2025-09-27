import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const complaintId = params.id

    // Mock complaint data - in real app, fetch from database
    const complaint = {
      id: complaintId,
      ticketNumber: "CP-2025-001",
      customerId: "4",
      customerName: "Lê Văn Customer",
      customerPhone: "0934567890",
      customerEmail: "customer@gmail.com",
      subject: "Xe giao chậm so với cam kết",
      description: "Đã đặt xe từ tháng 12/2024 nhưng đến nay vẫn chưa được giao xe.",
      category: "delivery",
      priority: "high",
      status: "in_progress",
      assignedTo: "2",
      assignedToName: "Nguyễn Văn Manager",
      dealerId: "dealer1",
      orderId: "ORD-2024-123",
      vehicleVin: "VF8P2024001234567",
      createdAt: new Date("2025-01-18"),
      updatedAt: new Date("2025-01-20"),
      followUpRequired: true,
      history: [
        {
          id: "1",
          action: "created",
          description: "Khiếu nại được tạo",
          userId: "4",
          userName: "Lê Văn Customer",
          timestamp: new Date("2025-01-18"),
        },
        {
          id: "2",
          action: "assigned",
          description: "Phân công cho Nguyễn Văn Manager",
          userId: "admin",
          userName: "Hệ thống",
          timestamp: new Date("2025-01-19"),
        },
        {
          id: "3",
          action: "status_changed",
          description: "Chuyển trạng thái từ 'Mới' sang 'Đang xử lý'",
          userId: "2",
          userName: "Nguyễn Văn Manager",
          timestamp: new Date("2025-01-20"),
        },
      ],
    }

    return NextResponse.json({
      success: true,
      data: complaint,
    })
  } catch (error) {
    console.error("Error fetching complaint:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch complaint" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const complaintId = params.id
    const body = await request.json()
    const { status, assignedTo, assignedToName, resolution, satisfactionRating } = body

    // Mock update - in real app, update database
    const updatedComplaint = {
      id: complaintId,
      status,
      assignedTo,
      assignedToName,
      resolution,
      satisfactionRating,
      updatedAt: new Date(),
      resolvedAt: status === "resolved" ? new Date() : undefined,
    }

    return NextResponse.json({
      success: true,
      data: updatedComplaint,
      message: "Khiếu nại đã được cập nhật thành công",
    })
  } catch (error) {
    console.error("Error updating complaint:", error)
    return NextResponse.json({ success: false, error: "Failed to update complaint" }, { status: 500 })
  }
}
