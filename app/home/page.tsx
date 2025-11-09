import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import HomePage from "@/components/home-page"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user completed onboarding
  const { data: onboardingResponse } = await supabase
    .from("onboarding_responses")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!onboardingResponse) {
    redirect("/onboarding")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get weekly stats (last 7 days)
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)

  const { data: sessions } = await supabase
    .from("pomodoro_sessions")
    .select("*")
    .eq("user_id", user.id)
    .gte("session_date", sevenDaysAgo.toISOString().split("T")[0])
    .order("session_date", { ascending: true })

  return <HomePage profile={profile} sessions={sessions || []} onboardingData={onboardingResponse} />
}
