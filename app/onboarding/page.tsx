import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import OnboardingQuiz from "@/components/onboarding-quiz"

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user already completed onboarding
  const { data: existingResponse } = await supabase
    .from("onboarding_responses")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (existingResponse) {
    redirect("/home")
  }

  return <OnboardingQuiz userId={user.id} />
}
