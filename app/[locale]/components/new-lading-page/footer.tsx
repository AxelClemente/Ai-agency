"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Linkedin } from "lucide-react"

export default function Footer() {
  const [email, setEmail] = useState("")

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  const footerLinks = {
    product: [
      { name: "Trust", href: "/trust" },
      { name: "AI HQ", href: "/ai-hq" },
      { name: "AI Studio", href: "/ai-studio" },
      { name: "Graph RAG", href: "/graph-rag" },
      { name: "Palmyra LLMs", href: "/palmyra-llms" },
      { name: "Try for free", href: "/try-free" },
      { name: "Request a demo", href: "/demo" },
    ],
    resources: [
      { name: "Guides", href: "/guides" },
      { name: "AI blog", href: "/blog" },
      { name: "AI Agent Library", href: "/agent-library" },
      { name: "Engineering blog", href: "/engineering-blog" },
      { name: "Enterprise AI agents", href: "/enterprise-agents" },
      { name: "AI content detector", href: "/content-detector" },
      { name: "Generative AI for retail", href: "/ai-retail" },
      { name: "Generative AI for insurance", href: "/ai-insurance" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Partners", href: "/partners" },
      { name: "Legal hub", href: "/legal" },
      { name: "Newsroom", href: "/newsroom" },
      { name: "Contact us", href: "/contact" },
    ],
    support: [
      { name: "Status", href: "/status" },
      { name: "Help center", href: "/help" },
      { name: "AI Academy", href: "/academy" },
      { name: "Developer docs", href: "/docs" },
    ],
  }

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Logo */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block">
                <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center bg-white">
                  <Image
                    src="/images/ai-favicon.png"
                    alt="AI Agency Logo"
                    width={48}
                    height={48}
                    className="object-contain w-12 h-12"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Product Links */}
            <div className="lg:col-span-1">
              <h3 className="text-white font-semibold text-lg mb-6">Product</h3>
              <ul className="space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="lg:col-span-1">
              <h3 className="text-white font-semibold text-lg mb-6">Resources</h3>
              <ul className="space-y-4">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="lg:col-span-1">
              <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="lg:col-span-1">
              <h3 className="text-white font-semibold text-lg mb-6">Support</h3>
              <ul className="space-y-4">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Signup - Spans remaining space */}
            <div className="lg:col-span-1">{/* This will be handled in the newsletter section below */}</div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-12 border-t border-gray-800">
          <div className="max-w-2xl">
            <h3 className="text-white text-2xl font-bold mb-2">Get the latest updates about enterprise AI</h3>
            <p className="text-gray-400 mb-6">Subscribete a AI Agency</p>

            <form onSubmit={handleNewsletterSubmit} className="flex gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-full flex items-center space-x-2"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">© 2025 AI Agency</div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {/* LinkedIn */}
              <Link
                href="https://linkedin.com/company/writer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-gray-400" />
              </Link>
              {/* Twitter/X */}
              <Link
                href="https://twitter.com/writer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                aria-label="Twitter/X"
              >
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              {/* Instagram */}
              <Link
                href="https://instagram.com/tu_cuenta"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect width="20" height="20" x="2" y="2" rx="5" strokeWidth="2" />
                  <circle cx="12" cy="12" r="5" strokeWidth="2" />
                  <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                </svg>
              </Link>
              {/* TikTok */}
              <Link
                href="https://www.tiktok.com/@tu_cuenta"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200 p-1"
                aria-label="TikTok"
              >
                <Image
                  src="/images/tiktokblanca.png"
                  alt="TikTok"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full rounded-full"
                />
              </Link>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <Link href="/settings" className="hover:text-white transition-colors duration-200">
                MANAGE SETTINGS
              </Link>
              <span>|</span>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                TERMS
              </Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                PRIVACY
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
