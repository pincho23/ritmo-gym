-- Add common variants while preserving all existing exercise IDs.
begin;
create or replace function public.gym_valid_workout(p jsonb) returns boolean
language plpgsql immutable set search_path = '' as $$
declare item jsonb; workout_date date;
begin
 if jsonb_typeof(p) <> 'object' or p is null then return false; end if;
 if p->>'exerciseId' is null or p->>'exerciseId' not in ('bench','incline','fly','pushup','bench_bar','bench_db','bench_machine','incline_bar','incline_db','incline_smith','decline_bar','decline_db','incline_fly','pec_deck','cable_fly_low','cable_fly_mid','cable_fly_high','dips','shoulder','lateral','front_db','front_bar','front_plate','front_cable','shoulder_bar','shoulder_db','arnold','shoulder_machine','lateral_cable','rear_db','face_pull','deadlift','row','pulldown','pullup','row_db','row_cable','row_machine','pulldown_neutral','pullover_cable','squat','legpress','lunge','legcurl','calf','goblet','bulgarian','leg_extension','romanian','hip_thrust','curl','triceps','curl_bar','curl_db','hammer','preacher','triceps_rope','triceps_overhead','skullcrusher','crunch','cable_crunch') then return false; end if;
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
commit;
