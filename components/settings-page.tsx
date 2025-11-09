"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useTranslation, type Language } from "@/lib/i18n"

export default function SettingsPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = useTranslation(language)

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang as Language)
  }

  return (
    <div className="min-h-screen bg-[#E8E4F3]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#C8C8E8]">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/home")}>
            <ArrowLeft className="h-5 w-5 text-[#5B6B9F]" />
          </Button>
          <h1 className="text-xl font-bold text-[#5B6B9F]">{t.settings}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        <Card className="bg-white border-[#C8C8E8]">
          <CardHeader>
            <CardTitle className="text-[#5B6B9F]">{t.language || "Language"}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={language} onValueChange={handleLanguageChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="en" />
                <Label htmlFor="en" className="cursor-pointer">
                  English
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tr" id="tr" />
                <Label htmlFor="tr" className="cursor-pointer">
                  Türkçe (Turkish)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="it" id="it" />
                <Label htmlFor="it" className="cursor-pointer">
                  Italiano (Italian)
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
