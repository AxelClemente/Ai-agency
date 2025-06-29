"use client"
import { useSidebar } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"

export function MobileSidebarDrawer() {
  const { setOpenMobile } = useSidebar()

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <button onClick={() => setOpenMobile(true)} className="p-2 rounded-md hover:bg-gray-100">
        <Menu className="h-6 w-6" />
      </button>
      <span className="font-bold text-lg">Ai Agency</span>
      <div />
    </div>
  )
} 