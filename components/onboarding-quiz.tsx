"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { useTranslation } from "@/lib/i18n"
import Image from "next/image"

interface OnboardingQuizProps {
  userId: string
}

const DISTRACTION_OPTIONS = [
  { id: "noise", label: "noise" },
  { id: "notifications", label: "notifications" },
  { id: "messyWorkspace", label: "messyWorkspace" },
  { id: "stress", label: "stress" },
  { id: "socialMedia", label: "socialMedia" },
  { id: "poorLighting", label: "poorLighting" },
]

const FOCUS_HELPER_OPTIONS = [
  { id: "breathing", label: "breathing" },
  { id: "stretching", label: "stretching" },
  { id: "walk", label: "walk" },
  { id: "water", label: "water" },
]

export default function OnboardingQuiz({ userId }: OnboardingQuizProps) {
  const [step, setStep] = useState<"intro" | "distractions" | "helpers">("intro")
  const [selectedDistractions, setSelectedDistractions] = useState<string[]>([])
  const [selectedHelpers, setSelectedHelpers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { language } = useLanguage()
  const t = useTranslation(language)

  const toggleDistraction = (id: string) => {
    setSelectedDistractions((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleHelper = (id: string) => {
    setSelectedHelpers((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleSubmit = async () => {
    if (selectedDistractions.length === 0 || selectedHelpers.length === 0) {
      setError("Please select at least one option for each question")
      return
    }

    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("onboarding_responses").insert({
        user_id: userId,
        distractions: selectedDistractions,
        focus_helpers: selectedHelpers,
      })

      if (error) throw error

      router.push("/home")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === "intro") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader className="text-center space-y-4">
              <Image
                src="/images/mascot-login.png"
                alt="Octo-Focus Mascot"
                width={120}
                height={120}
                className="mx-auto"
              />
              <CardTitle className="text-3xl text-[#5B6B9F]">Welcome to Octo-Focus!</CardTitle>
              <CardDescription className="text-base">{t.getToKnowYou}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setStep("distractions")} className="w-full" size="lg">
                {t.startOnboarding}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === "distractions") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <Card className="border-[#C8C8E8]">
            <CardHeader>
              <CardTitle className="text-2xl text-[#8BA3E8] text-center">{t.whatDistracts}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                {DISTRACTION_OPTIONS.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all ${
                      selectedDistractions.includes(option.id)
                        ? "bg-[#8BA3E8] text-white"
                        : "bg-[#8BA3E8]/20 text-[#5B6B9F]"
                    }`}
                    onClick={() => toggleDistraction(option.id)}
                  >
                    <Checkbox
                      id={option.id}
                      checked={selectedDistractions.includes(option.id)}
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#8BA3E8]"
                    />
                    <Label htmlFor={option.id} className="text-base font-normal cursor-pointer flex-1">
                      {t[option.label as keyof typeof t]}
                    </Label>
                  </div>
                ))}
              </div>
              {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("intro")} className="flex-1 rounded-xl">
                  {t.back}
                </Button>
                <Button
                  onClick={() => {
                    if (selectedDistractions.length === 0) {
                      setError("Please select at least one distraction")
                      return
                    }
                    setError(null)
                    setStep("helpers")
                  }}
                  className="flex-1 rounded-xl bg-[#8BA3E8] hover:bg-[#7A92D7]"
                >
                  {t.next}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="border-[#C8C8E8]">
          <CardHeader>
            <CardTitle className="text-2xl text-[#8BA3E8] text-center">{t.whatHelps}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              {FOCUS_HELPER_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all ${
                    selectedHelpers.includes(option.id) ? "bg-[#8BA3E8] text-white" : "bg-[#8BA3E8]/20 text-[#5B6B9F]"
                  }`}
                  onClick={() => toggleHelper(option.id)}
                >
                  <Checkbox
                    id={option.id}
                    checked={selectedHelpers.includes(option.id)}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#8BA3E8]"
                  />
                  <Label htmlFor={option.id} className="text-base font-normal cursor-pointer flex-1">
                    {t[option.label as keyof typeof t]}
                  </Label>
                </div>
              ))}
            </div>
            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("distractions")} className="flex-1 rounded-xl">
                {t.back}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 rounded-xl bg-[#8BA3E8] hover:bg-[#7A92D7]"
              >
                {isLoading ? "..." : t.finish}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
