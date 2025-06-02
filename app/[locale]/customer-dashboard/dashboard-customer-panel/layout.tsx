import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"

const inter = Inter({ subsets: ["latin"] })

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
      <div className="flex h-screen w-full">
        <aside className="w-64 border-r border-border bg-sidebar-background">
          <AppSidebar />
        </aside>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
