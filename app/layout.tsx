import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/components/language-provider"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "Octo-Focus - Personalized Pomodoro Focus App",
  description: "AI-powered focus app with personalized Pomodoro sessions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geistSans.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
