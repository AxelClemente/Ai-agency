import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import { MobileSidebarDrawer } from "./components/mobile-sidebar-drawer"

export const metadata: Metadata = {
  title: "Call Analysis Platform",
  description: "AI-powered call recording analysis platform",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full sm:flex-row">
        {/* Sidebar móvil como drawer (client component) */}
        <div className="sm:hidden">
          <MobileSidebarDrawer />
        </div>
        {/* Sidebar fijo en desktop */}
        <aside className="hidden sm:block w-64 border-r border-border bg-sidebar-background">
          <AppSidebar />
        </aside>
        {/* Contenido principal */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
