"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, Pause, X } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useTranslation } from "@/lib/i18n"
import { getAIDetector } from "@/lib/ai-detector"

interface PomodoroSessionProps {
  userId: string
  sessionType: string
  workDuration: number
  breakDuration: number
  quantity: number
  fatigueDetection: boolean
  focusHelpers: string[]
}

const BREAK_ACTIVITIES = {
  breathing: {
    name: "Breathing Exercise",
    icon: "🫁",
    instructions: "Take slow, deep breaths. Inhale for 4 seconds, hold for 4, exhale for 4.",
  },
  stretching: {
    name: "Stretching",
    icon: "🤸",
    instructions: "Stand up and stretch your arms, neck, and back. Roll your shoulders.",
  },
  walk: {
    name: "Quick Walk",
    icon: "🚶",
    instructions: "Take a short walk around your space. Move your body.",
  },
  water: {
    name: "Hydration Break",
    icon: "💧",
    instructions: "Drink a glass of water. Stay hydrated!",
  },
}

export default function PomodoroSession({
  userId,
  sessionType,
  workDuration,
  breakDuration,
  quantity,
  fatigueDetection,
  focusHelpers,
}: PomodoroSessionProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const t = useTranslation(language)

  const [currentRound, setCurrentRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(sessionType === "no-break" ? 0 : workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isWorkPhase, setIsWorkPhase] = useState(true)
  const [totalWorkSeconds, setTotalWorkSeconds] = useState(0)
  const [totalDistractedSeconds, setTotalDistractedSeconds] = useState(0)
  const [isCurrentlyDistracted, setIsCurrentlyDistracted] = useState(false)
  const [showMicroBreak, setShowMicroBreak] = useState(false)
  const [microBreakActivity, setMicroBreakActivity] = useState<keyof typeof BREAK_ACTIVITIES>("breathing")
  const [microBreakTimeLeft, setMicroBreakTimeLeft] = useState(60)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [allRoundsCompleted, setAllRoundsCompleted] = useState(false)
  const [distractionCount, setDistractionCount] = useState(0)
  const [consecutiveDistractions, setConsecutiveDistractions] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const distractionCheckInterval = useRef<NodeJS.Timeout | null>(null)
  const [aiInitialized, setAiInitialized] = useState(false)
  const [aiStatus, setAiStatus] = useState<"loading" | "ready" | "error">("loading")

  const isNoBreakMode = sessionType === "no-break"
  const totalWorkTime = isNoBreakMode ? 0 : workDuration * 60
  const progress = isNoBreakMode ? 0 : ((totalWorkTime - timeLeft) / totalWorkTime) * 100

  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.abs(seconds) / 60)
    const secs = Math.abs(seconds) % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const enableCamera = async () => {
    try {
      setAiStatus("loading")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      streamRef.current = stream

      const detector = getAIDetector()
      await detector.initialize()
      setAiInitialized(true)
      setAiStatus("ready")
      console.log("[v0] AI detector initialized successfully")
    } catch (error) {
      console.error("[v0] Camera/AI initialization error:", error)
      setAiStatus("error")
    }
  }

  const disableCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const checkForDistraction = async () => {
    if (!videoRef.current || !aiInitialized || !isRunning || !isWorkPhase) return

    try {
      const detector = getAIDetector()
      const result = await detector.detectDistraction(videoRef.current)

      console.log("[v0] Distraction check:", result)
      setIsCurrentlyDistracted(result.isDistracted)

      if (result.isDistracted && result.confidence > 0.75) {
        setConsecutiveDistractions((prev) => {
          const newCount = prev + 1
          console.log(`[v0] Consecutive distractions: ${newCount}/3`)

          if (newCount >= 3) {
            console.log("[v0] 3 distractions detected - triggering 1 minute break")
            suggestMicroBreak()
            return 0 // Reset counter
          }
          return newCount
        })
      } else {
        setConsecutiveDistractions(0)
      }
    } catch (error) {
      console.error("[v0] Error checking for distraction:", error)
    }
  }

  const suggestMicroBreak = () => {
    setIsRunning(false)
    setDistractionCount((prev) => prev + 1)

    let activity: keyof typeof BREAK_ACTIVITIES = "breathing"
    if (focusHelpers.includes("breathing")) {
      activity = "breathing"
    } else if (focusHelpers.includes("stretching")) {
      activity = "stretching"
    } else if (focusHelpers.includes("walk")) {
      activity = "walk"
    } else if (focusHelpers.includes("water")) {
      activity = "water"
    }
    setMicroBreakActivity(activity)
    setMicroBreakTimeLeft(60)
    setShowMicroBreak(true)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (showMicroBreak && microBreakTimeLeft > 0) {
      interval = setInterval(() => {
        setMicroBreakTimeLeft((prev) => {
          if (prev <= 1) {
            setShowMicroBreak(false)
            setIsRunning(true)
            setConsecutiveDistractions(0)
            return 60
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [showMicroBreak, microBreakTimeLeft])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        if (isWorkPhase) {
          setTotalWorkSeconds((prev) => prev + 1)
          if (isCurrentlyDistracted) {
            setTotalDistractedSeconds((prev) => prev + 1)
          }
        }

        if (isNoBreakMode) {
          setTimeLeft((prev) => prev + 1)
          setTotalFocusTime((prev) => prev + 1)
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (isWorkPhase) {
                setTotalFocusTime((prevTotal) => prevTotal + workDuration * 60)
                if (breakDuration > 0) {
                  setIsWorkPhase(false)
                  return breakDuration * 60
                } else {
                  if (currentRound < quantity) {
                    setCurrentRound((r) => r + 1)
                    return workDuration * 60
                  } else {
                    setAllRoundsCompleted(true)
                    endSession(true)
                    return 0
                  }
                }
              } else {
                if (currentRound < quantity) {
                  setCurrentRound((r) => r + 1)
                  setIsWorkPhase(true)
                  return workDuration * 60
                } else {
                  setAllRoundsCompleted(true)
                  endSession(true)
                  return 0
                }
              }
            }
            return prev - 1
          })
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [
    isRunning,
    isWorkPhase,
    workDuration,
    breakDuration,
    currentRound,
    quantity,
    isNoBreakMode,
    isCurrentlyDistracted,
  ])

  useEffect(() => {
    if (isRunning && isWorkPhase && aiInitialized) {
      distractionCheckInterval.current = setInterval(checkForDistraction, 2000)
    } else {
      if (distractionCheckInterval.current) {
        clearInterval(distractionCheckInterval.current)
      }
    }
    return () => {
      if (distractionCheckInterval.current) {
        clearInterval(distractionCheckInterval.current)
      }
    }
  }, [isRunning, isWorkPhase, aiInitialized])

  useEffect(() => {
    enableCamera()
    return () => {
      disableCamera()
    }
  }, [])

  const endSession = async (completed = false) => {
    disableCamera()

    const actualFocusMinutes = isNoBreakMode ? Math.floor(timeLeft / 60) : Math.floor(totalFocusTime / 60)
    const seashellsEarned = actualFocusMinutes * 5
    const concentrationPercentage =
      totalWorkSeconds > 0 ? Math.round(((totalWorkSeconds - totalDistractedSeconds) / totalWorkSeconds) * 100) : 100

    const supabase = createClient()
    const today = new Date()
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0]

    try {
      const { error: sessionError } = await supabase.from("pomodoro_sessions").insert({
        user_id: userId,
        session_type: sessionType,
        work_duration: workDuration,
        break_duration: breakDuration,
        actual_focus_time: actualFocusMinutes,
        distractions_count: distractionCount,
        seashells_earned: seashellsEarned,
        session_date: localDate,
      })

      if (sessionError) throw sessionError

      const { data: profile } = await supabase.from("profiles").select("total_seashells").eq("id", userId).single()

      if (profile) {
        await supabase
          .from("profiles")
          .update({ total_seashells: profile.total_seashells + seashellsEarned })
          .eq("id", userId)
      }

      const params = new URLSearchParams({
        focusTime: actualFocusMinutes.toString(),
        concentration: concentrationPercentage.toString(),
        seashells: seashellsEarned.toString(),
        completed: completed.toString(),
      })
      router.push(`/session-results?${params.toString()}`)
    } catch (error) {
      console.error("[v0] Error saving session:", error)
      alert("Failed to save session. Please try again.")
    }
  }

  const handleQuit = () => {
    if (confirm("Are you sure you want to quit this session? Your progress will be saved.")) {
      endSession(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E8E4F3]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#C8C8E8]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#8BA3E8]">
            {isWorkPhase ? t.focusTime : t.breakTime}
            {!isNoBreakMode && quantity > 1 && (
              <span className="text-sm ml-2 text-[#5B6B9F]">
                ({currentRound}/{quantity})
              </span>
            )}
          </h1>
          <Button variant="ghost" size="icon" onClick={handleQuit}>
            <X className="h-5 w-5 text-[#5B6B9F]" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        <Card className="bg-gradient-to-br from-[#8BA3E8] to-[#7A92D7] text-white border-0">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <div className="text-7xl font-bold font-mono">{formatTime(timeLeft)}</div>
              {!isNoBreakMode && <Progress value={progress} className="h-2 bg-white/20" />}
              <p className="text-lg opacity-90">{isWorkPhase ? t.startFocused : t.takeBreak}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1 bg-white text-[#8BA3E8] hover:bg-gray-50"
            onClick={() => setIsRunning(!isRunning)}
            disabled={showMicroBreak}
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                {t.pause}
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                {t.start}
              </>
            )}
          </Button>
        </div>

        <Card className="bg-white border-[#C8C8E8]">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#5B6B9F]">{t.aiMonitoringActive}</p>
              <span className="flex items-center gap-2 text-xs">
                {aiStatus === "loading" && (
                  <>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    <span className="text-yellow-600">Loading AI...</span>
                  </>
                )}
                {aiStatus === "ready" && (
                  <>
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                    <span className="text-green-600">{t.watchingForDistractions}</span>
                  </>
                )}
                {aiStatus === "error" && (
                  <>
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-red-500">Camera Error</span>
                  </>
                )}
              </span>
            </div>

            {isRunning && isWorkPhase && (
              <div className="flex items-center justify-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <span className="text-lg font-medium text-[#5B6B9F]">
                  {isCurrentlyDistracted ? "⚠️ Distracted" : "✓ Focused"}
                </span>
              </div>
            )}

            <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg bg-black" />
          </CardContent>
        </Card>
      </main>

      <Dialog open={showMicroBreak} onOpenChange={setShowMicroBreak}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl text-[#5B6B9F]">
              <span className="text-4xl">{BREAK_ACTIVITIES[microBreakActivity].icon}</span>
              Time for a Quick Break!
            </DialogTitle>
            <DialogDescription>AI detected you need a moment to refocus. Take a 1-minute break.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <p className="text-5xl font-bold font-mono text-orange-600">{microBreakTimeLeft}s</p>
                  <p className="font-medium text-[#5B6B9F]">{BREAK_ACTIVITIES[microBreakActivity].name}</p>
                  <p className="text-sm text-muted-foreground">{BREAK_ACTIVITIES[microBreakActivity].instructions}</p>
                  <p className="text-xs text-amber-700 bg-amber-100 rounded-full px-3 py-1 inline-block">
                    Session will auto-resume after break
                  </p>
                </div>
              </CardContent>
            </Card>
            <Button
              onClick={() => {
                setShowMicroBreak(false)
                setIsRunning(true)
                setConsecutiveDistractions(0)
              }}
              className="w-full bg-[#8BA3E8] hover:bg-[#7A92D7]"
            >
              Skip Break & Resume Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
