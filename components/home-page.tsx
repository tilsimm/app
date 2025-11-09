"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Settings, Calendar, Crown, LogOut } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useTranslation } from "@/lib/i18n"
import Image from "next/image"
import type { Profile, PomodoroSession, OnboardingResponse } from "@/lib/types"

interface HomePageProps {
  profile: Profile | null
  sessions: PomodoroSession[]
  onboardingData: OnboardingResponse
}

export default function HomePage({ profile, sessions, onboardingData }: HomePageProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { language } = useLanguage()
  const t = useTranslation(language)

  const motivationalMessages = [t.motivation1, t.motivation2, t.motivation3, t.motivation4, t.motivation5]
  const motivationalMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]

  const getWeeklyData = () => {
    const daysKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    const today = new Date()
    const weekData = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const dayIndex = date.getDay()
      const dayKey = daysKeys[dayIndex === 0 ? 6 : dayIndex - 1]

      const daySessions = sessions.filter((s) => s.session_date === dateStr)
      const seashells = daySessions.reduce((sum, s) => sum + s.seashells_earned, 0)

      weekData.push({
        day: t[dayKey as keyof typeof t] as string,
        seashells: seashells,
        fullDate: date.toLocaleDateString(language === "tr" ? "tr-TR" : language === "it" ? "it-IT" : "en-US", {
          month: "short",
          day: "numeric",
        }),
      })
    }

    return weekData
  }

  const getCurrentPeriod = () => {
    const now = new Date()
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ]
    const monthKey = monthNames[now.getMonth()]
    const year = now.getFullYear()

    const firstDayOfMonth = new Date(year, now.getMonth(), 1)
    const dayOfMonth = now.getDate()
    const weekOfMonth = Math.ceil((dayOfMonth + firstDayOfMonth.getDay()) / 7)

    return `${t[monthKey as keyof typeof t]} ${year} / ${weekOfMonth}. ${t.week}`
  }

  const weeklyData = getWeeklyData()
  const hasData = weeklyData.some((d) => d.seashells > 0)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#E8E4F3]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#C8C8E8] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#5B6B9F]">Octo-Focus</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#C8C8E8]">
              <span className="text-sm font-semibold text-[#5B6B9F]">{profile?.total_seashells || 0}</span>
              <Image src="/images/seashell-icon.png" alt="Seashell" width={20} height={20} className="object-contain" />
            </div>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5 text-[#5B6B9F]" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{t.menu}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push("/settings")
                      setIsMenuOpen(false)
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    {t.settings}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push("/calendar")
                      setIsMenuOpen(false)
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {t.calendar}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push("/focus")
                      setIsMenuOpen(false)
                    }}
                  >
                    <span className="mr-2">⏱️</span>
                    {t.focusTime}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" disabled>
                    <Crown className="mr-2 h-4 w-4" />
                    {t.premium}
                  </Button>
                  <div className="pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t.logout}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Weekly Chart */}
        <Card className="bg-white border-[#C8C8E8]">
          <CardHeader>
            <CardTitle className="text-[#5B6B9F]">{getCurrentPeriod()}</CardTitle>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <ChartContainer
                config={{
                  seashells: {
                    label: t.seashells || "Seashells",
                    color: "#8BA3E8",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E4F3" />
                    <XAxis dataKey="day" stroke="#5B6B9F" fontSize={12} />
                    <YAxis stroke="#5B6B9F" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="seashells" fill="#8BA3E8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-center">
                <div className="space-y-2">
                  <p className="text-muted-foreground">No data yet</p>
                  <p className="text-sm text-muted-foreground">Start your first focus session to see your progress!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-[#FFB3D9]">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <Image
                src="/images/mascot-seashells.png"
                alt="Motivational Octopus"
                width={100}
                height={100}
                className="object-contain"
              />
              <div className="flex-1">
                <p className="text-base text-[#5B6B9F]">{motivationalMessage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full h-16 text-lg rounded-2xl bg-[#8BA3E8] hover:bg-[#7A92D7] text-white"
          onClick={() => router.push("/focus")}
        >
          {t.timeToFocus}
        </Button>
      </main>
    </div>
  )
}
