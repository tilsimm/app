"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { useTranslation } from "@/lib/i18n"

interface SessionResultsProps {
  focusTime: number
  concentration: number
  seashells: number
  completed: boolean
}

export default function SessionResults({ focusTime, concentration, seashells, completed }: SessionResultsProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const t = useTranslation(language)

  const getFeedback = () => {
    if (!completed) {
      // Session was quit early - no celebration message
      return null
    }

    if (concentration >= 95) {
      return {
        message: t.perfectFocus || "Perfect focus! You stayed completely on track!",
        icon: "🎯",
        color: "from-green-500 to-emerald-600",
      }
    } else if (concentration >= 85) {
      return {
        message: t.greatJob || "Great job! You maintained excellent focus!",
        icon: "⭐",
        color: "from-blue-500 to-indigo-600",
      }
    } else if (concentration >= 70) {
      return {
        message: t.goodEffort || "Good effort! Keep working on your focus!",
        icon: "👍",
        color: "from-amber-500 to-orange-600",
      }
    } else {
      return {
        message: t.completedSession || "You completed the session! Every step counts!",
        icon: "💪",
        color: "from-purple-500 to-pink-600",
      }
    }
  }

  const feedback = getFeedback()

  return (
    <div className="min-h-screen bg-[#E8E4F3]">
      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {completed && feedback && (
          <div className="text-center space-y-4">
            <div className="text-8xl">{feedback.icon}</div>
            <h1 className="text-3xl font-bold text-balance text-[#5B6B9F]">
              {t.sessionComplete || "Session Complete!"}
            </h1>
            <p className="text-lg text-[#5B6B9F]">{feedback.message}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4">
          <Card className={`bg-gradient-to-r ${feedback?.color || "from-purple-500 to-pink-600"} text-white border-0`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{t.seashellsEarned}</p>
                  <p className="text-5xl font-bold">{seashells}</p>
                </div>
                <Image
                  src="/images/seashell-icon.png"
                  alt="Seashell"
                  width={64}
                  height={64}
                  className="opacity-80 object-contain"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white border-[#C8C8E8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-[#5B6B9F]">
                  <Target className="h-4 w-4" />
                  {t.focusTime || "Focus Time"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#5B6B9F]">
                  {focusTime} {t.min || "min"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#C8C8E8]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-[#5B6B9F]">
                  <TrendingUp className="h-4 w-4" />
                  {t.concentrationLevel || "Concentration"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{concentration}%</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-white border-[#FFB3D9]">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <Image
                src="/images/mascot-seashells.png"
                alt="Octopus Mascot"
                width={100}
                height={100}
                className="object-contain"
              />
              <div className="flex-1">
                <p className="font-medium text-[#5B6B9F] mb-2">{t.keepItUp || "Keep it up!"}</p>
                <p className="text-sm text-[#5B6B9F]">
                  {t.consistencyMessage ||
                    "Consistency is key to building better focus habits. Your progress is being tracked in your calendar and weekly stats."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full bg-[#8BA3E8] hover:bg-[#7A92D7] text-white"
            onClick={() => router.push("/focus")}
          >
            {t.startAnother || "Start Another Session"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full bg-white border-[#C8C8E8] text-[#5B6B9F]"
            onClick={() => router.push("/home")}
          >
            {t.backToHome || "Back to Home"}
          </Button>
        </div>
      </main>
    </div>
  )
}
