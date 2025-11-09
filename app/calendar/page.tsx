import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import CalendarView from "@/components/calendar-view"

export default async function CalendarPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get all sessions for the current month
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const { data: sessions } = await supabase
    .from("pomodoro_sessions")
    .select("*")
    .eq("user_id", user.id)
    .gte("session_date", firstDayOfMonth.toISOString().split("T")[0])
    .lte("session_date", lastDayOfMonth.toISOString().split("T")[0])
    .order("session_date", { ascending: true })

  return <CalendarView sessions={sessions || []} />
}
