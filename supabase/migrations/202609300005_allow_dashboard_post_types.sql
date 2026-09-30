-- Align the posts type constraint with the four supported composer modes.
-- Preserve any legacy values already stored in this project.
do $$
declare
  allowed_post_types text[];
begin
  select coalesce(array_agg(distinct post_type), array[]::text[])
    into allowed_post_types
  from public.posts
  where post_type is not null;

  allowed_post_types := allowed_post_types || array['thought', 'text', 'resource', 'question', 'project']::text[];

  select array_agg(distinct post_type)
    into allowed_post_types
  from unnest(allowed_post_types) as values_to_keep(post_type);

  alter table public.posts drop constraint if exists posts_type_check;

  execute format(
    'alter table public.posts add constraint posts_type_check check (post_type is not null and post_type = any (%L::text[]))',
    allowed_post_types
  );
end;
$$;