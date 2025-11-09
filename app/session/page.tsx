import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import PomodoroSession from "@/components/pomodoro-session"

export default async function SessionPage({
  searchParams,
}: {
  searchParams: Promise<{ type: string; work: string; break: string; fatigueDetection?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const params = await searchParams

  // Get onboarding data for personalized break suggestions
  const { data: onboardingData } = await supabase
    .from("onboarding_responses")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return (
    <PomodoroSession
      userId={user.id}
      sessionType={params.type}
      workDuration={Number.parseInt(params.work)}
      breakDuration={Number.parseInt(params.break)}
      fatigueDetection={params.fatigueDetection === "true"}
      focusHelpers={onboardingData?.focus_helpers || []}
    />
  )
}
