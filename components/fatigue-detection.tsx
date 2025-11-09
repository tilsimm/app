"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useTranslation } from "@/lib/i18n"
import { getAIDetector } from "@/lib/ai-detector"

interface FatigueDetectionProps {
  onComplete: (fatigueLevel: number, suggestedWork: number, suggestedBreak: number) => void
  onBack: () => void
}

export default function FatigueDetection({ onComplete, onBack }: FatigueDetectionProps) {
  const { language } = useLanguage()
  const t = useTranslation(language)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [cameraStarted, setCameraStarted] = useState(false)
  const [streamRef, setStreamRef] = useState<MediaStream | null>(null)
  const [modelsLoading, setModelsLoading] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setStreamRef(stream)
        setCameraStarted(true)
        console.log("[v0] Camera started successfully")

        setTimeout(() => {
          analyzeFatigue()
        }, 1000)
      }
    } catch (error) {
      console.error("[v0] Camera access error:", error)
      alert(t.cameraError || "Could not access camera. Please allow camera permissions.")
    }
  }

  const stopCamera = () => {
    if (streamRef) {
      streamRef.getTracks().forEach((track) => track.stop())
      setStreamRef(null)
      setCameraStarted(false)
    }
  }

  const analyzeFatigue = async () => {
    if (!videoRef.current) return

    setIsAnalyzing(true)
    setModelsLoading(true)
    setAnalysisProgress(0)

    try {
      const detector = getAIDetector()
      await detector.initialize()
      setModelsLoading(false)
      console.log("[v0] Starting 5-second fatigue analysis...")

      for (let i = 0; i <= 100; i += 20) {
        setAnalysisProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      const fatigueLevel = await detector.detectFatigue(videoRef.current)
      console.log("[v0] Detected fatigue level:", fatigueLevel + "%")

      let suggestedWork: number
      let suggestedBreak: number

      if (fatigueLevel >= 0 && fatigueLevel <= 24) {
        // Low fatigue: longest work sessions
        suggestedWork = 50
        suggestedBreak = 10
        console.log("[v0] Suggesting 50/10 for low fatigue")
      } else if (fatigueLevel >= 25 && fatigueLevel <= 40) {
        // Medium-low fatigue
        suggestedWork = 45
        suggestedBreak = 10
        console.log("[v0] Suggesting 45/10 for medium-low fatigue")
      } else if (fatigueLevel >= 41 && fatigueLevel <= 60) {
        // Medium fatigue
        suggestedWork = 35
        suggestedBreak = 5
        console.log("[v0] Suggesting 35/5 for medium fatigue")
      } else if (fatigueLevel >= 61 && fatigueLevel <= 75) {
        // High fatigue
        suggestedWork = 30
        suggestedBreak = 10
        console.log("[v0] Suggesting 30/10 for high fatigue")
      } else {
        // Very high fatigue (76-100)
        suggestedWork = 25
        suggestedBreak = 5
        console.log("[v0] Suggesting 25/5 for very high fatigue")
      }

      stopCamera()
      onComplete(fatigueLevel, suggestedWork, suggestedBreak)
    } catch (error) {
      console.error("[v0] Error analyzing fatigue:", error)
      setIsAnalyzing(false)
      setModelsLoading(false)
      setAnalysisProgress(0)
      alert("AI analysis failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-[#E8E4F3]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#C8C8E8]">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 text-[#8BA3E8]" />
          </Button>
          <h1 className="text-xl font-bold text-[#8BA3E8]">{t.aiFatigueDetection}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-white border-[#C8C8E8]">
          <CardContent className="pt-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-[#5B6B9F]">{t.aiPoweredPersonalization}</h2>
              <p className="text-sm text-[#8BA3E8]">{t.letAiAnalyze}</p>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
                    <div className="text-center space-y-2 px-4">
                      <p className="text-white font-medium">
                        {modelsLoading ? "Loading AI models..." : t.analyzingFatigue}
                      </p>
                      {!modelsLoading && (
                        <div className="w-64 bg-white/20 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-white h-full transition-all duration-1000"
                            style={{ width: `${analysisProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {cameraStarted && !isAnalyzing && (
                <div className="text-center text-sm text-[#8BA3E8]">
                  {t.cameraReady || "Camera ready - Analysis will start automatically"}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-purple-900 font-medium mb-2">{t.howItWorks}</p>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• {t.aiAnalyzesFacial}</li>
                <li>• {t.detectsFatigue}</li>
                <li>• {t.suggestsOptimal}</li>
                <li>• {t.maintainProductivity}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
