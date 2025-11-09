"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useTranslation } from "@/lib/i18n"
import type { PomodoroSession } from "@/lib/types"

interface CalendarViewProps {
  sessions: PomodoroSession[]
}

export default function CalendarView({ sessions }: CalendarViewProps) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const { language } = useLanguage()
  const t = useTranslation(language)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthKeys = [
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

  const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return sessions.filter((s) => s.session_date === dateStr)
  }

  const getDayStats = (date: Date) => {
    const daySessions = getSessionsForDate(date)
    const totalMinutes = daySessions.reduce((sum, s) => sum + s.actual_focus_time, 0)
    const totalSeashells = daySessions.reduce((sum, s) => sum + s.seashells_earned, 0)
    return { sessions: daySessions.length, minutes: totalMinutes, seashells: totalSeashells }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const renderCalendar = () => {
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const stats = getDayStats(date)
      const isToday = date.getTime() === today.getTime()
      const hasData = stats.sessions > 0

      days.push(
        <div
          key={day}
          className={`aspect-square border rounded-lg p-2 ${
            isToday ? "border-blue-500 bg-blue-50" : "border-border"
          } ${hasData ? "bg-green-50" : ""}`}
        >
          <div className="flex flex-col h-full">
            <span className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>{day}</span>
            {hasData && (
              <div className="mt-auto space-y-0.5">
                <div className="text-xs text-muted-foreground">
                  {stats.sessions} session{stats.sessions > 1 ? "s" : ""}
                </div>
                <div className="text-xs font-medium text-green-600">{stats.seashells} 🐚</div>
              </div>
            )}
          </div>
        </div>,
      )
    }

    return days
  }

  return (
    <div className="min-h-screen bg-[#E8E4F3]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#C8C8E8]">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/home")}>
            <ArrowLeft className="h-5 w-5 text-[#5B6B9F]" />
          </Button>
          <h1 className="text-xl font-bold text-[#5B6B9F]">{t.calendar}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Card className="bg-white border-[#C8C8E8]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#5B6B9F]">
                {t[monthKeys[month] as keyof typeof t]} {year}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayKeys.map((dayKey) => (
                <div key={dayKey} className="text-center text-sm font-medium text-muted-foreground capitalize">
                  {(t[dayKey as keyof typeof t] as string).slice(0, 3)}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
