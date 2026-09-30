alter table public.posts
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists showcase_id uuid references public.project_showcases(id) on delete set null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.posts'::regclass
      and conname = 'posts_metadata_object_check'
  ) then
    alter table public.posts
      add constraint posts_metadata_object_check
      check (jsonb_typeof(metadata) = 'object');
  end if;
end;
$$;

create index if not exists posts_showcase_id_idx
  on public.posts (showcase_id)
  where showcase_id is not null;

create or replace function public.validate_post_showcase_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.showcase_id is not null then
    if new.post_type <> 'project' or not exists (
      select 1
      from public.project_showcases s
      where s.id = new.showcase_id
        and s.owner_id = new.author_id
        and s.deleted_at is null
    ) then
      raise exception 'Post showcase must be an active showcase owned by the post author.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists posts_validate_showcase_owner on public.posts;
create trigger posts_validate_showcase_owner
before insert or update of showcase_id, author_id, post_type on public.posts
for each row execute function public.validate_post_showcase_owner();

create or replace view public.post_engagement_summary
with (security_invoker = true)
as
select
  p.id as post_id,
  count(distinct l.user_id)::integer as likes_count,
  count(distinct c.id)::integer as comments_count
from public.posts p
left join public.post_likes l on l.post_id = p.id
left join public.comments c on c.post_id = p.id and c.deleted_at is null
where p.deleted_at is null
group by p.id;

grant select on public.post_engagement_summary to anon, authenticated;

create or replace function public.publish_project_post(
  p_project_id uuid,
  p_content text,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  source_project public.projects%rowtype;
  workflow_definition jsonb := '{"nodes":[],"connections":[]}'::jsonb;
  new_showcase_id uuid;
  new_post_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication is required to publish a project.';
  end if;
  if nullif(trim(p_content), '') is null then
    raise exception 'Post content cannot be empty.';
  end if;
  if p_metadata is null or jsonb_typeof(p_metadata) <> 'object' then
    raise exception 'Post metadata must be a JSON object.';
  end if;

  select * into source_project
  from public.projects p
  where p.id = p_project_id
    and p.owner_id = current_user_id
    and p.deleted_at is null;

  if not found then
    raise exception 'Project not found or not owned by the current user.';
  end if;

  select w.definition into workflow_definition
  from public.project_workflows w
  where w.project_id = p_project_id
    and w.owner_id = current_user_id;

  insert into public.project_showcases (
    owner_id, title, description, project_type, visibility, local_project_id
  ) values (
    current_user_id,
    source_project.name,
    source_project.description,
    source_project.project_type,
    'public',
    source_project.id::text
  ) returning id into new_showcase_id;

  insert into public.project_showcase_versions (
    showcase_id, version_number, frameworks, metrics, preview_data
  ) values (
    new_showcase_id,
    1,
    array[]::text[],
    '{}'::jsonb,
    jsonb_build_object('workflow', workflow_definition, 'schema_version', 1)
  );

  insert into public.posts (
    author_id, post_type, content, visibility, metadata, showcase_id
  ) values (
    current_user_id, 'project', trim(p_content), 'public', p_metadata, new_showcase_id
  ) returning id into new_post_id;

  return new_post_id;
end;
$$;

revoke all on function public.publish_project_post(uuid, text, jsonb) from public, anon;
grant execute on function public.publish_project_post(uuid, text, jsonb) to authenticated;