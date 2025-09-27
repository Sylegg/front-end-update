// Authentication and role management system for VinFast dealership
export type UserRole = "guest" | "customer" | "dealer_staff" | "dealer_manager" | "evm_staff" | "admin"

export interface User {
  id: string
  email: string
  phone: string
  fullName: string
  role: UserRole
  dealerId?: string // For dealer staff and managers
  region?: string // For EVM staff
  permissions: string[]
  isActive: boolean
  createdAt: Date
  lastLogin?: Date
}

export interface Permission {
  slug: string
  name: string
  description: string
  module: string
}

// Permission definitions based on the Vietnamese requirements
export const PERMISSIONS: Permission[] = [
  // Catalog permissions
  { slug: "catalog.read", name: "Xem danh mục", description: "Xem thông tin sản phẩm", module: "catalog" },
  { slug: "catalog.manage", name: "Quản lý danh mục", description: "Tạo/sửa/xóa sản phẩm", module: "catalog" },

  // Inventory permissions
  { slug: "inventory.read", name: "Xem tồn kho", description: "Xem thông tin tồn kho", module: "inventory" },
  { slug: "inventory.manage", name: "Quản lý tồn kho", description: "Quản lý nhập/xuất kho", module: "inventory" },

  // Customer permissions
  { slug: "customers.read", name: "Xem khách hàng", description: "Xem thông tin khách hàng", module: "customers" },
  { slug: "customers.create", name: "Tạo khách hàng", description: "Tạo hồ sơ khách hàng mới", module: "customers" },
  {
    slug: "customers.update",
    name: "Cập nhật khách hàng",
    description: "Sửa thông tin khách hàng",
    module: "customers",
  },
  {
    slug: "customers.assign",
    name: "Phân công khách hàng",
    description: "Gán khách hàng cho nhân viên",
    module: "customers",
  },

  // Test drive permissions
  { slug: "testdrives.read", name: "Xem lái thử", description: "Xem lịch lái thử", module: "testdrives" },
  { slug: "testdrives.create", name: "Tạo lái thử", description: "Đặt lịch lái thử", module: "testdrives" },
  { slug: "testdrives.update", name: "Cập nhật lái thử", description: "Sửa lịch lái thử", module: "testdrives" },
  {
    slug: "testdrives.checkin",
    name: "Check-in lái thử",
    description: "Xác nhận khách đến lái thử",
    module: "testdrives",
  },

  // Quote permissions
  { slug: "quotes.read", name: "Xem báo giá", description: "Xem thông tin báo giá", module: "quotes" },
  { slug: "quotes.create", name: "Tạo báo giá", description: "Tạo báo giá mới", module: "quotes" },
  { slug: "quotes.update", name: "Cập nhật báo giá", description: "Sửa báo giá", module: "quotes" },
  { slug: "quotes.submit", name: "Gửi báo giá", description: "Gửi báo giá để phê duyệt", module: "quotes" },
  { slug: "quotes.approve", name: "Phê duyệt báo giá", description: "Phê duyệt/từ chối báo giá", module: "quotes" },
  {
    slug: "quotes.convert",
    name: "Chuyển đổi báo giá",
    description: "Chuyển báo giá thành đơn hàng",
    module: "quotes",
  },

  // Order permissions
  { slug: "orders.read", name: "Xem đơn hàng", description: "Xem thông tin đơn hàng", module: "orders" },
  { slug: "orders.create", name: "Tạo đơn hàng", description: "Tạo đơn hàng mới", module: "orders" },
  { slug: "orders.update", name: "Cập nhật đơn hàng", description: "Sửa đơn hàng", module: "orders" },
  { slug: "orders.approve", name: "Phê duyệt đơn hàng", description: "Phê duyệt đơn hàng", module: "orders" },
  { slug: "orders.cancel", name: "Hủy đơn hàng", description: "Hủy đơn hàng", module: "orders" },
  {
    slug: "orders.ready_for_delivery",
    name: "Sẵn sàng giao xe",
    description: "Đánh dấu sẵn sàng giao xe",
    module: "orders",
  },
  { slug: "orders.delivered", name: "Đã giao xe", description: "Xác nhận đã giao xe", module: "orders" },

  // Payment permissions
  { slug: "payments.read", name: "Xem thanh toán", description: "Xem thông tin thanh toán", module: "payments" },
  { slug: "payments.initiate", name: "Khởi tạo thanh toán", description: "Tạo yêu cầu thanh toán", module: "payments" },
  { slug: "payments.capture", name: "Thu tiền", description: "Xác nhận thu tiền", module: "payments" },
  { slug: "payments.refund", name: "Hoàn tiền", description: "Thực hiện hoàn tiền", module: "payments" },
  {
    slug: "payments.mark_offline",
    name: "Đánh dấu thanh toán offline",
    description: "Ghi nhận thanh toán ngoại tuyến",
    module: "payments",
  },

  // Promotion permissions
  { slug: "promotions.read", name: "Xem khuyến mãi", description: "Xem chương trình khuyến mãi", module: "promotions" },
  {
    slug: "promotions.create",
    name: "Tạo khuyến mãi",
    description: "Tạo chương trình khuyến mãi",
    module: "promotions",
  },
  {
    slug: "promotions.update",
    name: "Cập nhật khuyến mãi",
    description: "Sửa chương trình khuyến mãi",
    module: "promotions",
  },
  {
    slug: "promotions.delete",
    name: "Xóa khuyến mãi",
    description: "Xóa chương trình khuyến mãi",
    module: "promotions",
  },

  // Reports permissions
  {
    slug: "reports.read.self",
    name: "Xem báo cáo cá nhân",
    description: "Xem báo cáo của bản thân",
    module: "reports",
  },
  { slug: "reports.read.dealer", name: "Xem báo cáo đại lý", description: "Xem báo cáo cấp đại lý", module: "reports" },
  {
    slug: "reports.read.global",
    name: "Xem báo cáo toàn hệ thống",
    description: "Xem báo cáo toàn bộ hệ thống",
    module: "reports",
  },

  // Settings permissions
  { slug: "settings.users.read", name: "Xem người dùng", description: "Xem danh sách người dùng", module: "settings" },
  {
    slug: "settings.users.manage",
    name: "Quản lý người dùng",
    description: "Tạo/sửa/khóa người dùng",
    module: "settings",
  },
  {
    slug: "settings.integrations.manage",
    name: "Quản lý tích hợp",
    description: "Cấu hình tích hợp hệ thống",
    module: "settings",
  },
  {
    slug: "settings.policies.manage",
    name: "Quản lý chính sách",
    description: "Cấu hình chính sách hệ thống",
    module: "settings",
  },

  // Audit permissions
  { slug: "audit.read", name: "Xem nhật ký kiểm toán", description: "Xem lịch sử thao tác", module: "audit" },

  // Complaint permissions
  { slug: "complaints.create", name: "Tạo khiếu nại", description: "Tạo khiếu nại mới", module: "complaints" },
  { slug: "complaints.read", name: "Xem khiếu nại", description: "Xem thông tin khiếu nại", module: "complaints" },
  {
    slug: "complaints.update",
    name: "Cập nhật khiếu nại",
    description: "Sửa thông tin khiếu nại",
    module: "complaints",
  },
  {
    slug: "complaints.assign",
    name: "Phân công khiếu nại",
    description: "Gán khiếu nại cho nhân viên",
    module: "complaints",
  },
  {
    slug: "complaints.resolve",
    name: "Giải quyết khiếu nại",
    description: "Đánh dấu khiếu nại đã giải quyết",
    module: "complaints",
  },
  { slug: "complaints.delete", name: "Xóa khiếu nại", description: "Xóa khiếu nại", module: "complaints" },
]

// Role-based permission assignments
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  guest: ["catalog.read", "promotions.read"],
  customer: [
    "catalog.read",
    "promotions.read",
    "testdrives.create",
    "quotes.create",
    "payments.initiate",
    "orders.read", // self only
    "complaints.create", // self only
    "complaints.read", // self only
  ],
  dealer_staff: [
    "catalog.read",
    "inventory.read",
    "customers.read",
    "customers.create",
    "customers.update",
    "customers.assign",
    "testdrives.read",
    "testdrives.create",
    "testdrives.update",
    "testdrives.checkin",
    "promotions.read",
    "quotes.read",
    "quotes.create",
    "quotes.update",
    "quotes.submit",
    "quotes.convert",
    "orders.read",
    "orders.create",
    "orders.update",
    "orders.ready_for_delivery",
    "orders.delivered",
    "payments.read",
    "payments.initiate",
    "complaints.read",
    "complaints.create",
    "complaints.update",
    "reports.read.self",
  ],
  dealer_manager: [
    // All dealer staff permissions plus:
    "inventory.manage",
    "promotions.create",
    "promotions.update",
    "promotions.delete",
    "quotes.approve",
    "orders.approve",
    "orders.cancel",
    "payments.capture",
    "payments.refund",
    "payments.mark_offline",
    "complaints.assign",
    "complaints.resolve",
    "settings.users.read",
    "reports.read.dealer",
  ],
  evm_staff: [
    "catalog.manage",
    "inventory.manage",
    "promotions.create",
    "promotions.update",
    "promotions.delete",
    "complaints.read",
    "complaints.assign",
    "complaints.resolve",
    "reports.read.global",
  ],
  admin: [
    "settings.users.manage",
    "settings.integrations.manage",
    "settings.policies.manage",
    "complaints.read",
    "complaints.assign",
    "complaints.resolve",
    "complaints.delete",
    "audit.read",
    // Plus all read permissions for system oversight
  ],
}

// Mock user session management
let currentUser: User | null = null

export function getCurrentUser(): User | null {
  return currentUser
}

export function setCurrentUser(user: User | null): void {
  currentUser = user
}

export function hasPermission(permission: string, user?: User): boolean {
  const u = user || getCurrentUser()
  if (!u) return false
  return u.permissions.includes(permission)
}

export function hasAnyPermission(permissions: string[], user?: User): boolean {
  return permissions.some((permission) => hasPermission(permission, user))
}

export function hasAllPermissions(permissions: string[], user?: User): boolean {
  return permissions.every((permission) => hasPermission(permission, user))
}

export function canAccessModule(module: string, user?: User): boolean {
  const u = user || getCurrentUser()
  if (!u) return false

  const modulePermissions = PERMISSIONS.filter((p) => p.module === module).map((p) => p.slug)

  return hasAnyPermission(modulePermissions, u)
}

// Data scope helpers for RBAC
export function getDataScope(user?: User): "global" | "dealer" | "self" | "none" {
  const u = user || getCurrentUser()
  if (!u) return "none"

  switch (u.role) {
    case "admin":
    case "evm_staff":
      return "global"
    case "dealer_manager":
      return "dealer"
    case "dealer_staff":
    case "customer":
      return "self"
    default:
      return "none"
  }
}

export function canAccessDealerData(dealerId: string, user?: User): boolean {
  const u = user || getCurrentUser()
  if (!u) return false

  const scope = getDataScope(u)
  if (scope === "global") return true
  if (scope === "dealer") return u.dealerId === dealerId
  return false
}

// Mock authentication functions
export async function signIn(email: string, password: string): Promise<User | null> {
  // Mock implementation - in real app, this would call your auth service
  const mockUsers: User[] = [
    // Admin account
    {
      id: "1",
      email: "admin@vinfast.vn",
      phone: "0901234567",
      fullName: "Quản trị viên hệ thống",
      role: "admin",
      permissions: [...ROLE_PERMISSIONS.admin, ...ROLE_PERMISSIONS.dealer_manager, ...ROLE_PERMISSIONS.dealer_staff],
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date(),
    },

    // EVM Staff account
    {
      id: "2",
      email: "evm@vinfast.vn",
      phone: "0945678901",
      fullName: "Phạm Thị EVM",
      role: "evm_staff",
      region: "Toàn quốc",
      permissions: ROLE_PERMISSIONS.evm_staff,
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date(),
    },

    // Dealer Manager account
    {
      id: "3",
      email: "manager@dealer1.vn",
      phone: "0912345678",
      fullName: "Nguyễn Văn Manager",
      role: "dealer_manager",
      dealerId: "dealer1",
      permissions: [...ROLE_PERMISSIONS.dealer_manager, ...ROLE_PERMISSIONS.dealer_staff],
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date(),
    },

    // Dealer Staff account
    {
      id: "4",
      email: "staff@dealer1.vn",
      phone: "0923456789",
      fullName: "Trần Thị Staff",
      role: "dealer_staff",
      dealerId: "dealer1",
      permissions: ROLE_PERMISSIONS.dealer_staff,
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date(),
    },

    // Customer account
    {
      id: "5",
      email: "customer@gmail.com",
      phone: "0934567890",
      fullName: "Lê Văn Customer",
      role: "customer",
      permissions: ROLE_PERMISSIONS.customer,
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date(),
    },
  ]

  const user = mockUsers.find((u) => u.email === email)
  if (user) {
    setCurrentUser(user)
    return user
  }
  return null
}

export async function signOut(): Promise<void> {
  setCurrentUser(null)
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function requireAuth(): User {
  const user = getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export function requireRole(allowedRoles: UserRole[]): User {
  const user = requireAuth()
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Access denied. Required roles: ${allowedRoles.join(", ")}`)
  }
  return user
}

export function requirePermission(permission: string): User {
  const user = requireAuth()
  if (!hasPermission(permission, user)) {
    throw new Error(`Access denied. Required permission: ${permission}`)
  }
  return user
}
