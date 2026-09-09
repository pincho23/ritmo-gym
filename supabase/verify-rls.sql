-- Read-only deployment checks. Expect RLS=true, two policies, no UPDATE/DELETE grants.
select relname, relrowsecurity from pg_class where oid='public.gym_events'::regclass;
select policyname,cmd,qual,with_check from pg_policies where tablename='gym_events';
select grantee,privilege_type from information_schema.role_table_grants where table_schema='public' and table_name='gym_events' and grantee in ('anon','authenticated');
-- Then use the public API with two actual authenticated users to verify isolation,
-- insertion, retries, and denial of attempts to read/write another user's user_id.
