"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Sparkles, Play, Plus, Minus, Camera } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useTranslation } from "@/lib/i18n"
import type { OnboardingResponse } from "@/lib/types"
import FatigueDetection from "@/components/fatigue-detection"

interface FocusSelectionProps {
  userId: string
  onboardingData: OnboardingResponse | null
}

interface PomodoroOption {
  id: string
  work: number
  break: number
}

const POMODORO_OPTIONS: PomodoroOption[] = [
  { id: "25/5", work: 25, break: 5 },
  { id: "30/10", work: 30, break: 10 },
  { id: "45/5", work: 45, break: 5 },
  { id: "50/10", work: 50, break: 10 },
]

export default function FocusSelection({ userId, onboardingData }: FocusSelectionProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const t = useTranslation(language)

  const [showCustom, setShowCustom] = useState(false)
  const [customWork, setCustomWork] = useState(25)
  const [customBreak, setCustomBreak] = useState(5)
  const [showFatigueDetection, setShowFatigueDetection] = useState(false)
  const [fatigueResult, setFatigueResult] = useState<{
    level: number
    work: number
    break: number
  } | null>(null)

  const [quantities, setQuantities] = useState<Record<string, number>>({
    "25/5": 1,
    "30/10": 1,
    "45/5": 1,
    "50/10": 1,
    "no-break": 1,
    custom: 1,
  })

  const incrementQuantity = (optionId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [optionId]: Math.min(prev[optionId] + 1, 10), // Max 10 sessions
    }))
  }

  const decrementQuantity = (optionId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [optionId]: Math.max(prev[optionId] - 1, 1), // Min 1 session
    }))
  }

  const handleSelectOption = (option: PomodoroOption) => {
    const params = new URLSearchParams({
      type: option.id,
      work: option.work.toString(),
      break: option.break.toString(),
      quantity: quantities[option.id].toString(),
    })
    router.push(`/session?${params.toString()}`)
  }

  const handleNoBreak = () => {
    const params = new URLSearchParams({
      type: "no-break",
      work: "0",
      break: "0",
      quantity: quantities["no-break"].toString(),
    })
    router.push(`/session?${params.toString()}`)
  }

  const handleCustomSession = () => {
    const params = new URLSearchParams({
      type: "custom",
      work: customWork.toString(),
      break: customBreak.toString(),
      quantity: quantities.custom.toString(),
    })
    router.push(`/session?${params.toString()}`)
  }

  const handleFatigueDetectionComplete = (level: number, work: number, breakTime: number) => {
    setFatigueResult({ level, work, break: breakTime })
    setCustomWork(work)
    setCustomBreak(breakTime)
    setShowFatigueDetection(false)
  }

  if (showFatigueDetection) {
    return (
      <FatigueDetection onComplete={handleFatigueDetectionComplete} onBack={() => setShowFatigueDetection(false)} />
    )
  }

  if (showCustom) {
    return (
      <div className="min-h-screen bg-[#E8E4F3]">
        <header className="bg-white/80 backdrop-blur-sm border-b border-[#C8C8E8]">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setShowCustom(false)}>
              <ArrowLeft className="h-5 w-5 text-[#8BA3E8]" />
            </Button>
            <h1 className="text-xl font-bold text-[#8BA3E8]">{t.custom}</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="bg-white border-[#C8C8E8]">
            <CardContent className="pt-6 space-y-6">
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="font-medium text-purple-900">{t.aiFatigueDetection}</p>
                        <p className="text-sm text-purple-700">{t.letAiAnalyze}</p>
                      </div>
                      <Button
                        onClick={() => setShowFatigueDetection(true)}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {t.startAiDetection}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {fatigueResult && (
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <p className="text-2xl font-bold text-purple-900">
                        {fatigueResult.level}% {t.tired}
                      </p>
                      <p className="text-sm text-purple-700">
                        {fatigueResult.work}min/{fatigueResult.break}min {t.pomodoroIsBest}
                      </p>
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <img src="/images/mascot-seashells.png" alt="Octo" className="h-16 w-16 object-contain" />
                      </div>
                      <Button
                        onClick={handleCustomSession}
                        className="w-full bg-[#8BA3E8] hover:bg-[#7A92D7] mt-4"
                        size="lg"
                      >
                        {t.startSession}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8E4F3]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#C8C8E8]">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/home")}>
            <ArrowLeft className="h-5 w-5 text-[#8BA3E8]" />
          </Button>
          <h1 className="text-xl font-bold text-[#8BA3E8]">{t.focusTime}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-md space-y-3">
        {POMODORO_OPTIONS.map((option) => (
          <Card key={option.id} className="bg-white border-[#C8C8E8]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-12 rounded bg-[#8BA3E8] hover:bg-[#7A92D7] text-white"
                    onClick={() => incrementQuantity(option.id)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <div className="h-6 w-12 rounded bg-[#8BA3E8] flex items-center justify-center text-white font-semibold text-sm">
                    {quantities[option.id]}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-12 rounded bg-[#8BA3E8] hover:bg-[#7A92D7] text-white"
                    onClick={() => decrementQuantity(option.id)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex-1">
                  <p className="text-lg font-medium text-[#8BA3E8]">
                    {option.work}min/{option.break}min
                  </p>
                </div>

                <Button
                  size="icon"
                  className="h-10 w-10 rounded-full bg-[#8BA3E8] hover:bg-[#7A92D7]"
                  onClick={() => handleSelectOption(option)}
                >
                  <Play className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-white border-[#C8C8E8]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-[72px]" /> {/* Spacer to align with other options */}
              <div className="flex-1">
                <p className="text-lg font-medium text-[#8BA3E8]">{t.custom}</p>
              </div>
              <Button
                size="icon"
                className="h-10 w-10 rounded-full bg-[#8BA3E8] hover:bg-[#7A92D7]"
                onClick={() => setShowCustom(true)}
              >
                <Play className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#C8C8E8]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-[72px]" /> {/* Spacer to align with other options */}
              <div className="flex-1">
                <p className="text-lg font-medium text-[#8BA3E8]">{t.noBreak}</p>
              </div>
              <Button
                size="icon"
                className="h-10 w-10 rounded-full bg-[#8BA3E8] hover:bg-[#7A92D7]"
                onClick={handleNoBreak}
              >
                <Play className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
