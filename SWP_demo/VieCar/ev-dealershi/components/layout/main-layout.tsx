"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface MainLayoutProps {
  children: React.ReactNode
  activeModule?: string
  onModuleChange?: (module: string) => void
}

export function MainLayout({ children, activeModule: parentActiveModule, onModuleChange }: MainLayoutProps) {
  const { user } = useAuth()
  const [localActiveModule, setLocalActiveModule] = useState("dashboard")

  const activeModule = parentActiveModule || localActiveModule
  const handleModuleChange = onModuleChange || setLocalActiveModule

  if (!user) return null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeModule={activeModule} onModuleChange={handleModuleChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} activeModule={activeModule} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
