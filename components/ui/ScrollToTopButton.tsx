"use client"
import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 200)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleClick = () => {
    const hero = document.getElementById("hero")
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (!visible) return null

  return (
    <button
      aria-label="Volver arriba"
      onClick={handleClick}
      className="flex fixed right-4 bottom-4 md:right-8 md:bottom-8 z-50 items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-600 shadow-lg hover:bg-indigo-700 transition-colors duration-200 group"
    >
      <ArrowUp className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:-translate-y-1 transition-transform duration-200" />
    </button>
  )
} 