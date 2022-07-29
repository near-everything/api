-- create schemas
create schema everything;
create schema everything_private;

-- create types
create type everything.option_type as enum ('text', 'company', 'size');

-- create base type
create table everything.base (
  created_at timestamp default now(),
  updated_at timestamp default now(),
  created_by text
);
comment on table everything.base is E'@omit';

-- create user + auth types
create table everything.user (
  id text not null,
  primary key (id)
) inherits (everything.base);
comment on table everything.user is E'@omit create,update';

alter table everything.base add column created_by text references everything.user(id);
create index on everything.base (created_by);

create table everything.invite (
  phone_number text not null,
  is_approved boolean default false,
  primary key (phone_number)
) inherits (everything.base);
comment on table everything.invite is E'@omit update';

-- create labels
-- create category
create table everything.category (
  id serial primary key,
  name text not null check (char_length(name) < 80) unique,
  description text,
  is_approved boolean default false
) inherits (everything.base);

-- create subcategory, attribute, and option
create table everything.subcategory (
  id serial primary key,
  category_id int not null references everything.category(id) on delete cascade,
  name text not null check (char_length(name) < 80),
  description text,
  is_approved boolean default false,
  unique(category_id, name)
) inherits (everything.base);
create index on everything.subcategory (category_id);

create table everything.attribute (
  id serial primary key,
  name text not null check (char_length(name) < 80) unique,
  description text,
  type everything.option_type,
  is_approved boolean default false
) inherits (everything.base);
comment on table everything.attribute is E'@omit create';

create table everything.option (
  id serial primary key,
  value text not null check (char_length(value) < 80),
  type everything.option_type,
  is_approved boolean default false
) inherits (everything.base);

-- create associations and relationships
create table everything.association (
  subcategory_id int references everything.subcategory(id) on delete cascade,
  attribute_id int references everything.attribute(id) on delete cascade,
  primary key (subcategory_id, attribute_id)
) inherits (everything.base);
comment on table everything.association is E'@omit update';
create index on everything.association (subcategory_id);
create index on everything.association (attribute_id);

create table everything.relationship (
  attribute_id int references everything.attribute(id) on delete cascade,
  option_id int references everything.option(id) on delete cascade,
  primary key (attribute_id, option_id)
) inherits (everything.base);
comment on table everything.relationship is E'@omit update';
create index on everything.relationship (attribute_id);
create index on everything.relationship (option_id);

-- create thing
create table everything.thing (
  id serial primary key,
  category_id int not null references everything.category(id),
  subcategory_id int not null references everything.subcategory(id),
  owner_id text not null references everything.user(id),
  media text [],
  quantity int not null default 1,
  metadata json
) inherits (everything.base);
comment on table everything.thing is E'@omit create,update';
create index on everything.thing (category_id);
create index on everything.thing (subcategory_id);
create index on everything.thing (owner_id);

-- create request
create table everything.request (
  id serial primary key,
  requester_id text not null references everything.user(id),
  media text [],
  reference_link text,
  description text,
  quantity int not null default 1,
  metadata json
) inherits (everything.base);
comment on table everything.request is E'@omit update';
create index on everything.request (requester_id);

-- create characteristic
create table everything.characteristic (
  thing_id int references everything.thing(id) on delete cascade,
  attribute_id int references everything.attribute(id) on delete cascade,
  option_id int references everything.option(id) on delete cascade,
  primary key (thing_id, attribute_id, option_id)
) inherits (everything.base);
create index on everything.characteristic (thing_id);
create index on everything.characteristic (attribute_id);
create index on everything.characteristic (option_id);

-- create help, idea, concern
create table everything.help (
  description text not null
) inherits (everything.base);
comment on table everything.help is E'@omit delete';

create table everything.idea (
  description text not null
) inherits (everything.base);
comment on table everything.idea is E'@omit update';

create table everything.concern (
  description text not null
) inherits (everything.base);
comment on table everything.concern is E'@omit update';

-- create roles
create role everything_postgraphile login password 'anything-postgraphile'; -- change this in Production
create role everything_anon; -- not logged in
create role everything_user; -- logged in
create role everything_admin;

-- grant relationships
grant everything_anon to everything_user;
grant everything_user to everything_admin;
grant everything_admin to everything_postgraphile;

-- revoke execute permission for public user group on new functions
alter default privileges revoke execute on functions from public;
-- grant privileges
-- to schema
grant usage on schema everything to everything_anon;
-- to create sequence ids
grant usage, select on all sequences in schema everything to everything_anon;
-- to users & auth types
grant insert on table everything.user to everything_anon;
grant select,update,delete on table everything.user to everything_user;
grant select,insert on table everything.invite to everything_anon;
grant delete on table everything.invite to everything_admin;
-- to labels
grant select,insert on table everything.category to everything_user;
grant update,delete on table everything.category to everything_admin;
grant select,insert on table everything.subcategory to everything_user;
grant update,delete on table everything.subcategory to everything_admin;
grant select,insert on table everything.attribute to everything_user;
grant update,delete on table everything.attribute to everything_admin;
grant select,insert on table everything.option to everything_user;
grant update,delete on table everything.option to everything_admin;
grant select,insert on table everything.association to everything_user;
grant update,delete on table everything.association to everything_admin;
grant select,insert on table everything.relationship to everything_user;
grant update,delete on table everything.relationship to everything_admin;
-- to things
grant select,insert,update on table everything.thing to everything_user;
grant delete on table everything.thing to everything_admin;
grant select,insert,update on table everything.characteristic to everything_user;
-- to requests
grant select,insert,update on table everything.request to everything_user;
grant delete on table everything.request to everything_admin;
-- to help, idea, concern
grant select,insert on table everything.help to everything_user;
grant delete on table everything.help to everything_admin;
grant select,insert on table everything.idea to everything_user;
grant delete on table everything.idea to everything_admin;
grant select,insert on table everything.concern to everything_user;
grant delete on table everything.concern to everything_admin;
-- RLS 
-- users & auth types
alter table everything.user enable row level security;
-- any user can see other users
create policy select_user on everything.user for select to everything_user
  using (true);
create policy insert_user on everything.user for insert to everything_anon
  with check (true);
  using (id = nullif(current_setting('jwt.claims.firebase', true), '')::text);
-- only the user themself can update their own record
create policy update_user on everything.user for update to everything_user
  using (id = nullif(current_setting('jwt.claims.firebase', true), '')::text);
-- only the user themself can delete their own record
create policy delete_user on everything.user for delete to everything_user
  using (id = nullif(current_setting('jwt.claims.firebase', true), '')::text);

-- create functions (functions are private)
-- updated_at
create function everything_private.set_updated_at() returns trigger as $$
begin
  new.updated_at := current_timestamp;
  return new;
end;
$$ language plpgsql;

-- created_by
create function everything_private.set_created_by() returns trigger as $$
begin
  new.created_by := current_setting('jwt.claims.firebase');
  return new;
end;
$$ language plpgsql;

-- create triggers
create trigger base_updated_at before update
  on everything.base
  for each row
  execute procedure everything_private.set_updated_at();

create trigger category_created_by before insert
  on everything.category
  for each row
  execute procedure everything_private.set_created_by();