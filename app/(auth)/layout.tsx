import type React from "react"
import { ModeToggle } from "@/components/mode-toggle"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      {children}
    </div>
  )
}
