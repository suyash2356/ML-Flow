-- Keep generated usernames within the common 30-character profile limit.
-- Replacing the function updates the existing auth.users trigger in place.
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
  generated_username := left(base_username, 17) || '_' || left(replace(new.id::text, '-', ''), 12);
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