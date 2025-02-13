import { ChevronRight } from "lucide-react"

interface BreadcrumbProps {
  section: string
  onReset: () => void
}

export function Breadcrumb({ section, onReset }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-[18px] font-semibold text-third-gray mb-4 pt-6 pb-3 font-['Open_Sans']">
      <button 
        onClick={onReset}
        className={`hover:text-foreground transition-colors ${section === "About service" ? "text-foreground" : ""}`}
      >
        About service
      </button>
      <ChevronRight className="h-4 w-4" />
      <span className={`${section !== "About service" ? "text-foreground" : ""}`}>
        {section}
      </span>
    </div>
  )
}
