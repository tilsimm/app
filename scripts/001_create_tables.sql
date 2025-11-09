-- Create users profile table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  created_at timestamp with time zone default now(),
  total_seashells integer default 0
);

-- Create onboarding responses table
create table if not exists public.onboarding_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  distractions text[] not null,
  focus_helpers text[] not null,
  created_at timestamp with time zone default now()
);

-- Create pomodoro sessions table
create table if not exists public.pomodoro_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  session_type text not null, -- '25/5', '30/10', '45/5', '50/10', 'no-break', 'custom'
  work_duration integer not null, -- in minutes
  break_duration integer not null, -- in minutes
  actual_focus_time integer not null, -- in minutes
  distractions_count integer default 0,
  seashells_earned integer not null,
  session_date date not null,
  created_at timestamp with time zone default now()
);

-- Create micro breaks table (for AI-suggested breaks during sessions)
create table if not exists public.micro_breaks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.pomodoro_sessions(id) on delete cascade,
  break_type text not null, -- 'breathing', 'stretching', etc.
  duration integer not null, -- in seconds
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.onboarding_responses enable row level security;
alter table public.pomodoro_sessions enable row level security;
alter table public.micro_breaks enable row level security;

-- Profiles policies
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Onboarding responses policies
create policy "onboarding_select_own"
  on public.onboarding_responses for select
  using (auth.uid() = user_id);

create policy "onboarding_insert_own"
  on public.onboarding_responses for insert
  with check (auth.uid() = user_id);

create policy "onboarding_update_own"
  on public.onboarding_responses for update
  using (auth.uid() = user_id);

-- Pomodoro sessions policies
create policy "sessions_select_own"
  on public.pomodoro_sessions for select
  using (auth.uid() = user_id);

create policy "sessions_insert_own"
  on public.pomodoro_sessions for insert
  with check (auth.uid() = user_id);

create policy "sessions_update_own"
  on public.pomodoro_sessions for update
  using (auth.uid() = user_id);

-- Micro breaks policies
create policy "breaks_select_own"
  on public.micro_breaks for select
  using (
    exists (
      select 1 from public.pomodoro_sessions
      where pomodoro_sessions.id = micro_breaks.session_id
      and pomodoro_sessions.user_id = auth.uid()
    )
  );

create policy "breaks_insert_own"
  on public.micro_breaks for insert
  with check (
    exists (
      select 1 from public.pomodoro_sessions
      where pomodoro_sessions.id = micro_breaks.session_id
      and pomodoro_sessions.user_id = auth.uid()
    )
  );
