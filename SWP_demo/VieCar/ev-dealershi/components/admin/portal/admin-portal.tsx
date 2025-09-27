"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield } from "lucide-react"
import { roleDefinitions } from "./data"

interface AdminPortalProps {
  children: React.ReactNode
  initialTab?: string
}

export function AdminPortalContainer({ children, initialTab = "rbac" }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedRole, setSelectedRole] = useState<keyof typeof roleDefinitions>("dealer_staff")

  const getRoleBadge = (role: keyof typeof roleDefinitions) => {
    const roleConfig = roleDefinitions[role]
    return <Badge className={roleConfig?.color || "bg-gray-100 text-gray-800"}>{roleConfig?.name || role}</Badge>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">VinFast RBAC Admin Portal</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {getRoleBadge(selectedRole)}
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as keyof typeof roleDefinitions)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleDefinitions).map(([key, role]) => (
                    <SelectItem key={key} value={key}>
                      {role.name} - {role.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">Đăng xuất</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 md:grid-cols-9 lg:grid-cols-10 xl:grid-cols-11">
            <TabsTrigger value="rbac">RBAC System</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {children}
        </Tabs>
      </div>
    </div>
  )
}
