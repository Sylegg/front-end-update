"use client"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, CheckSquare, XCircle } from "lucide-react"
import { roleDefinitions } from "./data"

export function RbacTab() {
  return (
    <TabsContent value="rbac" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hệ thống RBAC - Vai trò & Quyền hạn</h2>
        <Button><Plus className="mr-2 h-4 w-4"/>Thêm vai trò</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(roleDefinitions).map(([key, role]) => (
          <Card key={key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{role.name}</CardTitle>
                <Badge className={role.color}>{key}</Badge>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Modules truy cập:</h4>
                  <div className="flex flex-wrap gap-1">
                    {role.modules.map((module) => (
                      <Badge key={module} variant="outline" className="text-xs">{module}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Quyền hạn ({role.permissions.length}):</h4>
                  <div className="max-h-32 overflow-y-auto">
                    <div className="space-y-1">
                      {role.permissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <CheckSquare className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-muted-foreground">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">Xem chi tiết</Button>
                  <Button size="sm" variant="outline"><Edit className="h-4 w-4"/></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ma trận quyền hạn</CardTitle>
          <CardDescription>Tổng quan quyền hạn theo vai trò</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Quyền hạn</th>
                  {Object.entries(roleDefinitions).map(([key, role]) => (
                    <th key={key} className="text-center p-2 min-w-24">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{role.name}</span>
                        <Badge className={`${role.color} text-xs mt-1`}>{key}</Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from(new Set(Object.values(roleDefinitions).flatMap((role) => role.permissions)))
                  .sort()
                  .map((permission) => (
                    <tr key={permission} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-mono text-xs">{permission}</td>
                      {Object.entries(roleDefinitions).map(([key, role]) => (
                        <td key={key} className="text-center p-2">
                          {role.permissions.includes(permission) ? (
                            <CheckSquare className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
