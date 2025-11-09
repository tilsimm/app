export interface Profile {
  id: string
  username: string
  created_at: string
  total_seashells: number
}

export interface OnboardingResponse {
  id: string
  user_id: string
  distractions: string[]
  focus_helpers: string[]
  created_at: string
}

export interface PomodoroSession {
  id: string
  user_id: string
  session_type: "25/5" | "30/10" | "45/5" | "50/10" | "no-break" | "custom"
  work_duration: number
  break_duration: number
  actual_focus_time: number
  distractions_count: number
  seashells_earned: number
  session_date: string
  created_at: string
}

export interface MicroBreak {
  id: string
  session_id: string
  break_type: "breathing" | "stretching" | "eye-rest"
  duration: number
  created_at: string
}

export interface WeeklyStats {
  date: string
  seashells: number
  minutes: number
}
