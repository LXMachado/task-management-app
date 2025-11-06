import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "TaskUdo",
  description: "A comprehensive task management application with Google Calendar integration",
  generator: 'TaskUdo'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.variable} font-sans`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider defaultTheme="system" storageKey="task-app-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}