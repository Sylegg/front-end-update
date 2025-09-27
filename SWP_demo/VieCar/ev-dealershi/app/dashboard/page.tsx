"use client"

import { useState } from "react"
import { useAuth, AuthProvider } from "@/components/auth/auth-provider"
import { MainLayout } from "@/components/layout/main-layout"
import { DealerDashboard } from "@/components/dealer/dealer-dashboard"
import { EVMDashboard } from "@/components/evm/evm-dashboard"
import { QuoteManagement } from "@/components/quotes/quote-management"
import { OrderManagement } from "@/components/orders/order-management"
import { TestDriveManagement } from "@/components/dealer/test-drive-management"
import { ProductCatalog } from "@/components/catalog/product-catalog"
import { InventoryManagement } from "@/components/inventory/inventory-management"
import { CustomerManagement } from "@/components/customers/customer-management"
import { PaymentManagement } from "@/components/payments/payment-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RbacTab } from "@/components/admin/portal/rbac-tab"
import { ApprovalsTab } from "@/components/admin/portal/approvals-tab"
import { InventoryTab } from "@/components/admin/portal/inventory-tab"
import { BookingsTab } from "@/components/admin/portal/bookings-tab"
import { QuotesTab } from "@/components/admin/portal/quotes-tab"
import { OrdersTab } from "@/components/admin/portal/orders-tab"
import { StaffTab } from "@/components/admin/portal/staff-tab"
import { PromotionsTab } from "@/components/admin/portal/promotions-tab"
import { ReportsTab } from "@/components/admin/portal/reports-tab"

function DashboardContent() {
  const { user } = useAuth()
  const [activeModule, setActiveModule] = useState("dashboard")

  if (!user) return null

  const renderContent = () => {
    switch (activeModule) {
      case "dashboard":
        if (user.role === "dealer_staff" || user.role === "dealer_manager") {
          return <DealerDashboard />
        }
        if (user.role === "evm_staff") {
          return <EVMDashboard />
        }
        if (user.role === "admin") {
          // Render Admin tabs inline inside dashboard (no separate /admin page)
          return (
            <div className="space-y-6">
              <Tabs defaultValue="rbac" className="w-full">
                <TabsList className="grid w-full grid-cols-7 md:grid-cols-9 lg:grid-cols-10 xl:grid-cols-11">
                  <TabsTrigger value="rbac">RBAC</TabsTrigger>
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

                <RbacTab />
                <TabsContent value="workflows" className="space-y-6">
                  <div className="text-sm text-muted-foreground">Workflows đang được tách riêng. Sẽ bổ sung sau.</div>
                </TabsContent>
                <ApprovalsTab />
                <InventoryTab />
                <BookingsTab />
                <QuotesTab />
                <OrdersTab />
                <StaffTab />
                <PromotionsTab />
                <ReportsTab />
              </Tabs>
            </div>
          )
        }
        return <div>Dashboard cho vai trò: {user.role}</div>
      case "testdrives":
        return <TestDriveManagement />
      case "quotes":
        return <QuoteManagement />
      case "orders":
        return <OrderManagement />
      case "catalog":
        return <ProductCatalog />
      case "inventory":
        return <InventoryManagement />
      case "customers":
        return <CustomerManagement />
      case "payments":
        return <PaymentManagement />
      default:
        return <div>Module: {activeModule}</div>
    }
  }

  return (
    <MainLayout activeModule={activeModule} onModuleChange={setActiveModule}>
      {renderContent()}
    </MainLayout>
  )
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}
