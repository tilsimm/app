import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import SessionResults from "@/components/session-results"

export default async function SessionResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ focusTime: string; concentration: string; seashells: string; completed: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const params = await searchParams

  return (
    <SessionResults
      focusTime={Number.parseInt(params.focusTime)}
      concentration={Number.parseInt(params.concentration)}
      seashells={Number.parseInt(params.seashells)}
      completed={params.completed === "true"}
    />
  )
}
