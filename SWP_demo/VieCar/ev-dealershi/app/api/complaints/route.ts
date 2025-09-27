import { type NextRequest, NextResponse } from "next/server"

// Mock complaints data
const complaints = [
  {
    id: "1",
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
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const priority = searchParams.get("priority")
    const dealerId = searchParams.get("dealerId")

    let filteredComplaints = complaints

    if (status && status !== "all") {
      filteredComplaints = filteredComplaints.filter((c) => c.status === status)
    }

    if (category && category !== "all") {
      filteredComplaints = filteredComplaints.filter((c) => c.category === category)
    }

    if (priority && priority !== "all") {
      filteredComplaints = filteredComplaints.filter((c) => c.priority === priority)
    }

    if (dealerId) {
      filteredComplaints = filteredComplaints.filter((c) => c.dealerId === dealerId)
    }

    return NextResponse.json({
      success: true,
      data: filteredComplaints,
      total: filteredComplaints.length,
    })
  } catch (error) {
    console.error("Error fetching complaints:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch complaints" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      subject,
      description,
      category,
      priority = "medium",
      dealerId,
      orderId,
      vehicleVin,
    } = body

    // Validate required fields
    if (!customerId || !customerName || !subject || !description || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Generate ticket number
    const ticketNumber = `CP-${new Date().getFullYear()}-${String(complaints.length + 1).padStart(3, "0")}`

    const newComplaint = {
      id: String(complaints.length + 1),
      ticketNumber,
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      subject,
      description,
      category,
      priority,
      status: "new",
      dealerId,
      orderId,
      vehicleVin,
      createdAt: new Date(),
      updatedAt: new Date(),
      followUpRequired: true,
    }

    complaints.push(newComplaint)

    return NextResponse.json({
      success: true,
      data: newComplaint,
      message: "Khiếu nại đã được tạo thành công",
    })
  } catch (error) {
    console.error("Error creating complaint:", error)
    return NextResponse.json({ success: false, error: "Failed to create complaint" }, { status: 500 })
  }
}
