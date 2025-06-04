import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/bottom-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Member Management System",
  description: "Manage member payments and Qurbani distribution",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
     <html lang="en">
      <body className={inter.className}>
        <div className="pb-16 md:pb-0">{children}</div>
        <BottomNav />
      </body>
    </html>
  )
}
