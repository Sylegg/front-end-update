"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Shield, Bell, Mail, Smartphone } from "lucide-react"

export function SystemSettings() {
  const [settings, setSettings] = useState({
    // General settings
    systemName: "VinFast RBAC System",
    systemDescription: "Hệ thống quản lý bán xe điện với phân quyền vai trò",
    maintenanceMode: false,

    // Security settings
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireMFA: true,
    passwordMinLength: 8,

    // Approval thresholds
    discountThreshold: 5,
    managerDiscountThreshold: 10,
    paymentCaptureThreshold: 50000000,

    // Notification settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,

    // Integration settings
    paymentGateway: "VNPay",
    eInvoiceProvider: "VNPT",
    smsProvider: "Viettel",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = () => {
    // In real app, save to backend
    console.log("Saving settings:", settings)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Cài đặt hệ thống</h2>
        <p className="text-muted-foreground">Cấu hình các thông số và chính sách của hệ thống</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="approvals">Phê duyệt</TabsTrigger>
          <TabsTrigger value="integrations">Tích hợp</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Cài đặt chung</span>
              </CardTitle>
              <CardDescription>Cấu hình thông tin cơ bản của hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">Tên hệ thống</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => handleSettingChange("systemName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemDescription">Mô tả</Label>
                  <Input
                    id="systemDescription"
                    value={settings.systemDescription}
                    onChange={(e) => handleSettingChange("systemDescription", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Chế độ bảo trì</Label>
                  <p className="text-sm text-muted-foreground">Tạm dừng hệ thống để bảo trì</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Cài đặt bảo mật</span>
              </CardTitle>
              <CardDescription>Cấu hình các chính sách bảo mật và xác thực</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Thời gian hết phiên (phút)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Số lần đăng nhập tối đa</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange("maxLoginAttempts", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Độ dài mật khẩu tối thiểu</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange("passwordMinLength", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bắt buộc MFA</Label>
                    <p className="text-sm text-muted-foreground">Yêu cầu xác thực 2 yếu tố</p>
                  </div>
                  <Switch
                    checked={settings.requireMFA}
                    onCheckedChange={(checked) => handleSettingChange("requireMFA", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Ngưỡng phê duyệt</CardTitle>
              <CardDescription>Cấu hình các ngưỡng yêu cầu phê duyệt theo Vietnamese requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="discountThreshold">Ngưỡng chiết khấu tự động (%)</Label>
                  <Input
                    id="discountThreshold"
                    type="number"
                    value={settings.discountThreshold}
                    onChange={(e) => handleSettingChange("discountThreshold", Number.parseFloat(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Chiết khấu ≤ {settings.discountThreshold}% được phê duyệt tự động
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="managerDiscountThreshold">Ngưỡng phê duyệt Manager (%)</Label>
                  <Input
                    id="managerDiscountThreshold"
                    type="number"
                    value={settings.managerDiscountThreshold}
                    onChange={(e) => handleSettingChange("managerDiscountThreshold", Number.parseFloat(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Chiết khấu {settings.discountThreshold}% - {settings.managerDiscountThreshold}% cần Manager phê
                    duyệt
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentCaptureThreshold">Ngưỡng thu tiền Manager (VND)</Label>
                  <Input
                    id="paymentCaptureThreshold"
                    type="number"
                    value={settings.paymentCaptureThreshold}
                    onChange={(e) => handleSettingChange("paymentCaptureThreshold", Number.parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Thanh toán ≤ {settings.paymentCaptureThreshold.toLocaleString("vi-VN")} VND Manager có thể xử lý
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Quy tắc phê duyệt hiện tại:</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    • Chiết khấu ≤ {settings.discountThreshold}%:{" "}
                    <Badge className="bg-green-500 text-white">Tự động</Badge>
                  </p>
                  <p>
                    • Chiết khấu {settings.discountThreshold}% - {settings.managerDiscountThreshold}%:{" "}
                    <Badge className="bg-blue-500 text-white">Manager</Badge>
                  </p>
                  <p>
                    • Chiết khấu &gt; {settings.managerDiscountThreshold}%:{" "}
                    <Badge className="bg-red-500 text-white">EVM/Admin</Badge>
                  </p>
                  <p>
                    • Thu tiền ≤ {settings.paymentCaptureThreshold.toLocaleString("vi-VN")} VND:{" "}
                    <Badge className="bg-blue-500 text-white">Manager</Badge>
                  </p>
                  <p>
                    • Thu tiền &gt; {settings.paymentCaptureThreshold.toLocaleString("vi-VN")} VND:{" "}
                    <Badge className="bg-red-500 text-white">Admin</Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tích hợp thanh toán</CardTitle>
                <CardDescription>Cấu hình cổng thanh toán và hóa đơn điện tử</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Cổng thanh toán</Label>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-500 text-white">Đã kết nối</Badge>
                    <span>{settings.paymentGateway}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nhà cung cấp hóa đơn điện tử</Label>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-500 text-white">Đã kết nối</Badge>
                    <span>{settings.eInvoiceProvider}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Thông báo</span>
                </CardTitle>
                <CardDescription>Cấu hình các kênh thông báo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <Label>Email</Label>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <Label>SMS</Label>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <Label>Push Notifications</Label>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Lưu cài đặt</Button>
      </div>
    </div>
  )
}
