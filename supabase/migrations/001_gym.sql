-- Event log: immutable workouts and deletion markers; UUIDs make offline retries idempotent.
begin;
create or replace function public.gym_valid_workout(p jsonb) returns boolean
language plpgsql immutable set search_path = '' as $$
declare item jsonb; workout_date date;
begin
 if jsonb_typeof(p) <> 'object' or p is null then return false; end if;
 if p->>'exerciseId' is null or p->>'exerciseId' not in ('bench','incline','fly','squat','legpress','lunge','legcurl','calf','deadlift','row','pulldown','pullup','shoulder','lateral','curl','triceps','pushup','crunch') then return false; end if;
 if p->>'date' is null or (p->>'date') !~ '^\d{4}-\d{2}-\d{2}$' then return false; end if;
 workout_date := (p->>'date')::date;
 if jsonb_typeof(p->'notes') is distinct from 'string' or length(p->>'notes') > 1000 then return false; end if;
 if jsonb_typeof(p->'sets') is distinct from 'array' then return false; end if;
 if jsonb_array_length(p->'sets') not between 1 and 50 then return false; end if;
 for item in select value from jsonb_array_elements(p->'sets') loop
  if jsonb_typeof(item->'reps') is distinct from 'number' or jsonb_typeof(item->'kg') is distinct from 'number' then return false; end if;
  if (item->>'reps')::numeric not between 1 and 1000 or (item->>'reps')::numeric <> trunc((item->>'reps')::numeric) or (item->>'kg')::numeric not between 0 and 2000 then return false; end if;
 end loop;
 return true;
exception when others then return false;
end;
$$;
create table if not exists public.gym_events (
 id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check (kind in ('workout','delete')),
 target_id uuid,
 payload jsonb,
 created_at timestamptz not null default now(),
 received_at timestamptz not null default now(),
 constraint gym_event_shape check (
  (kind='workout' and target_id is null and public.gym_valid_workout(payload)) or
  (kind='delete' and target_id is not null and payload is null)
 )
);
create index if not exists gym_events_owner_id on public.gym_events(user_id,id);
alter table public.gym_events enable row level security;
revoke all on public.gym_events from anon, authenticated;
grant select, insert on public.gym_events to authenticated;
create policy "gym_read_own" on public.gym_events for select to authenticated using ((select auth.uid())=user_id);
create policy "gym_insert_own" on public.gym_events for insert to authenticated with check ((select auth.uid())=user_id);
-- No UPDATE or DELETE grant: a stale device cannot overwrite another device's history.
commit;
