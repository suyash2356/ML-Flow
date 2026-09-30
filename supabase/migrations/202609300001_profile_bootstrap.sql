-- Creates the required public profile for new Supabase Auth users.
-- Review existing auth.users triggers before applying this migration.
create or replace function public.handle_ml_flow_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base_username text;
  generated_username text;
  profile_display_name text;
begin
  base_username := lower(regexp_replace(
    coalesce(new.raw_user_meta_data ->> 'username', split_part(coalesce(new.email, ''), '@', 1), 'user'),
    '[^a-z0-9_]+',
    '_',
    'g'
  ));
  base_username := nullif(trim(both '_' from base_username), '');
  base_username := coalesce(base_username, 'user');
  generated_username := left(base_username, 24) || '_' || left(replace(new.id::text, '-', ''), 8);
  profile_display_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
    base_username
  );

  insert into public.profiles (id, username, display_name, status, created_at, updated_at)
  values (new.id, generated_username, profile_display_name, 'active', now(), now())
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists ml_flow_profile_after_signup on auth.users;
create trigger ml_flow_profile_after_signup
after insert on auth.users
for each row execute function public.handle_ml_flow_new_user();