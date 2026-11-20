-- Dedicated IILA Supabase project only. No applicant data in shared product databases.
begin;
create table public.iila_cases (
 id uuid primary key, reference text unique not null, owner_hash text not null,
 created_at timestamptz not null default now(), delete_after timestamptz not null,
 legal_hold boolean not null default false,
 status text not null default 'received' check(status in ('received','awaiting_review','legal_review','needs_evidence','documenting','ready_for_decision','referred','closed')),
 high_risk boolean not null, language text not null check(language in ('en','fa')),
 payload_sealed text not null, notes_sealed text, notified_at timestamptz
);
create table public.iila_uploads (
 id uuid primary key, owner_hash text not null, created_at timestamptz not null default now(),
 state text not null check(state in ('reserved','ready','failed','attached')),
 metadata_sealed text, case_id uuid references public.iila_cases(id) on delete cascade
);
create index iila_upload_owner on public.iila_uploads(owner_hash,created_at);
create table public.iila_rates (key text primary key,window_start timestamptz not null,count int not null);
create table public.iila_audit (
 id bigint generated always as identity primary key, created_at timestamptz not null default now(),
 actor_id uuid not null, action text not null, case_id uuid
);
alter table public.iila_cases enable row level security;
alter table public.iila_cases force row level security;
alter table public.iila_uploads enable row level security;
alter table public.iila_uploads force row level security;
alter table public.iila_rates enable row level security;
alter table public.iila_rates force row level security;
alter table public.iila_audit enable row level security;
alter table public.iila_audit force row level security;
revoke all on public.iila_cases,public.iila_uploads,public.iila_rates,public.iila_audit from anon,authenticated,public;
grant select,insert,update,delete on public.iila_cases,public.iila_uploads,public.iila_rates to service_role;
grant select,insert on public.iila_audit to service_role;
grant usage,select on sequence public.iila_audit_id_seq to service_role;

create function public.iila_ready() returns boolean language sql security invoker set search_path='' as $$
 select exists(select 1 from storage.buckets where id='iila-evidence' and not public);
$$;
create function public.iila_rate_limit(p_key text,p_limit int) returns boolean
 language plpgsql security invoker set search_path='' as $$
declare n int;
begin
 insert into public.iila_rates(key,window_start,count) values(p_key,now(),1)
 on conflict(key) do update set
 count=case when public.iila_rates.window_start<now()-interval '1 hour' then 1 else public.iila_rates.count+1 end,
 window_start=case when public.iila_rates.window_start<now()-interval '1 hour' then now() else public.iila_rates.window_start end
 returning count into n;
 return n<=p_limit;
end $$;
create function public.iila_reserve_upload(p_id uuid,p_owner text) returns text
 language plpgsql security invoker set search_path='' as $$
declare existing public.iila_uploads;
begin
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_owner,0));
 select * into existing from public.iila_uploads where id=p_id;
 if found then
  if existing.owner_hash=p_owner and existing.state='ready' then return 'exists';end if;
  raise exception 'invalid_upload';
 end if;
 if (select count(*) from public.iila_uploads where owner_hash=p_owner and state<>'failed' and created_at>now()-interval '1 hour')>=5 then raise exception 'upload_limit';end if;
 insert into public.iila_uploads(id,owner_hash,state) values(p_id,p_owner,'reserved');
 return 'reserved';
end $$;
create function public.iila_submit(p_id uuid,p_reference text,p_owner text,p_sealed text,p_files uuid[],p_risk boolean,p_language text,p_retention int)
 returns text language plpgsql security invoker set search_path='' as $$
declare previous public.iila_cases; n int;
begin
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_owner,0));
 select * into previous from public.iila_cases where id=p_id;
 if found then
  if previous.owner_hash<>p_owner then raise exception 'invalid_request';end if;
  return previous.reference;
 end if;
 if p_retention<1 or p_retention>9999 or cardinality(p_files)>5 then raise exception 'invalid_request';end if;
 select count(*) into n from public.iila_uploads where id=any(p_files) and owner_hash=p_owner and state='ready' and created_at>now()-interval '1 hour';
 if n<>cardinality(p_files) then raise exception 'invalid_evidence';end if;
 insert into public.iila_cases(id,reference,owner_hash,payload_sealed,high_risk,language,delete_after)
 values(p_id,p_reference,p_owner,p_sealed,p_risk,p_language,now()+pg_catalog.make_interval(days=>p_retention));
 update public.iila_uploads set case_id=p_id,state='attached' where id=any(p_files);
 return p_reference;
end $$;
revoke all on function public.iila_ready(),public.iila_rate_limit(text,int),public.iila_reserve_upload(uuid,text),public.iila_submit(uuid,text,text,text,uuid[],boolean,text,int) from public,anon,authenticated;
grant execute on function public.iila_ready(),public.iila_rate_limit(text,int),public.iila_reserve_upload(uuid,text),public.iila_submit(uuid,text,text,text,uuid[],boolean,text,int) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('iila-evidence','iila-evidence',false,3145828,array['application/octet-stream']);
-- No Storage policies for anon/authenticated: access only through the authorised server.
commit;
