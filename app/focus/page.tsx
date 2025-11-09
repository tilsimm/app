import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import FocusSelection from "@/components/focus-selection"

export default async function FocusPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get onboarding data for personalized recommendations
  const { data: onboardingData } = await supabase
    .from("onboarding_responses")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return <FocusSelection userId={user.id} onboardingData={onboardingData} />
}
