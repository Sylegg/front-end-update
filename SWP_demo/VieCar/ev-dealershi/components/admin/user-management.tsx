"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DataTable } from "@/components/ui/data-table"
import { Switch } from "@/components/ui/switch"
import { UserPlus, Edit, Lock, Unlock, Trash2 } from "lucide-react"
import type { User, UserRole } from "@/lib/auth"

// Mock user data
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@vinfast.vn",
    phone: "0901234567",
    fullName: "Quản trị viên hệ thống",
    role: "admin",
    permissions: [],
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date("2025-01-20"),
  },
  {
    id: "2",
    email: "manager@dealer1.vn",
    phone: "0912345678",
    fullName: "Nguyễn Văn Manager",
    role: "dealer_manager",
    dealerId: "dealer1",
    permissions: [],
    isActive: true,
    createdAt: new Date("2024-02-15"),
    lastLogin: new Date("2025-01-20"),
  },
  {
    id: "3",
    email: "staff@dealer1.vn",
    phone: "0923456789",
    fullName: "Trần Thị Staff",
    role: "dealer_staff",
    dealerId: "dealer1",
    permissions: [],
    isActive: true,
    createdAt: new Date("2024-03-10"),
    lastLogin: new Date("2025-01-19"),
  },
  {
    id: "4",
    email: "evm.staff@vinfast.vn",
    phone: "0934567890",
    fullName: "Lê Văn EVM",
    role: "evm_staff",
    region: "north",
    permissions: [],
    isActive: true,
    createdAt: new Date("2024-01-20"),
    lastLogin: new Date("2025-01-18"),
  },
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    email: "",
    phone: "",
    fullName: "",
    role: "dealer_staff" as UserRole,
    dealerId: "",
    region: "",
    isActive: true,
  })

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      admin: "Quản trị viên",
      evm_staff: "Nhân viên EVM",
      dealer_manager: "Quản lý đại lý",
      dealer_staff: "Nhân viên đại lý",
      customer: "Khách hàng",
      guest: "Khách",
    }
    return labels[role]
  }

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      admin: "bg-red-500",
      evm_staff: "bg-purple-500",
      dealer_manager: "bg-blue-500",
      dealer_staff: "bg-green-500",
      customer: "bg-orange-500",
      guest: "bg-gray-500",
    }
    return colors[role]
  }

  const handleCreateUser = () => {
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      permissions: [],
      createdAt: new Date(),
      lastLogin: undefined,
    }
    setUsers([...users, user])
    setIsCreateDialogOpen(false)
    setNewUser({
      email: "",
      phone: "",
      fullName: "",
      role: "dealer_staff",
      dealerId: "",
      region: "",
      isActive: true,
    })
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user)))
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const userColumns = [
    {
      key: "fullName" as const,
      label: "Họ tên",
      sortable: true,
    },
    {
      key: "email" as const,
      label: "Email",
      sortable: true,
    },
    {
      key: "phone" as const,
      label: "Điện thoại",
      sortable: true,
    },
    {
      key: "role" as const,
      label: "Vai trò",
      sortable: true,
      render: (value: UserRole) => (
        <Badge className={`${getRoleBadgeColor(value)} text-white`}>{getRoleLabel(value)}</Badge>
      ),
    },
    {
      key: "dealerId" as const,
      label: "Đại lý",
      render: (value: string) => value || "-",
    },
    {
      key: "isActive" as const,
      label: "Trạng thái",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>{value ? "Hoạt động" : "Tạm khóa"}</Badge>
      ),
    },
    {
      key: "lastLogin" as const,
      label: "Đăng nhập cuối",
      render: (value: Date | undefined) => (value ? value.toLocaleDateString("vi-VN") : "Chưa đăng nhập"),
    },
  ]

  const userActions = (user: User) => (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" onClick={() => setEditingUser(user)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleToggleUserStatus(user.id)}>
        {user.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDeleteUser(user.id)}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
          <p className="text-muted-foreground">Tạo và quản lý tài khoản người dùng trong hệ thống</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm người dùng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tạo người dùng mới</DialogTitle>
              <DialogDescription>Nhập thông tin để tạo tài khoản người dùng mới</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                  Họ tên
                </Label>
                <Input
                  id="fullName"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Điện thoại
                </Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Vai trò
                </Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dealer_staff">Nhân viên đại lý</SelectItem>
                    <SelectItem value="dealer_manager">Quản lý đại lý</SelectItem>
                    <SelectItem value="evm_staff">Nhân viên EVM</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(newUser.role === "dealer_staff" || newUser.role === "dealer_manager") && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dealerId" className="text-right">
                    Đại lý
                  </Label>
                  <Input
                    id="dealerId"
                    value={newUser.dealerId}
                    onChange={(e) => setNewUser({ ...newUser, dealerId: e.target.value })}
                    className="col-span-3"
                    placeholder="dealer1"
                  />
                </div>
              )}
              {newUser.role === "evm_staff" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="region" className="text-right">
                    Khu vực
                  </Label>
                  <Select value={newUser.region} onValueChange={(value) => setNewUser({ ...newUser, region: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="north">Miền Bắc</SelectItem>
                      <SelectItem value="central">Miền Trung</SelectItem>
                      <SelectItem value="south">Miền Nam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Kích hoạt
                </Label>
                <Switch
                  id="isActive"
                  checked={newUser.isActive}
                  onCheckedChange={(checked) => setNewUser({ ...newUser, isActive: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateUser}>
                Tạo người dùng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>Tổng cộng {users.length} người dùng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={users}
            columns={userColumns}
            actions={userActions}
            searchable={true}
            exportable={true}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
