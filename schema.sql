-- create schemas
create schema everything;
create schema everything_private;

-- create types
create type everything.option_type as enum ('text', 'company', 'size');

-- create base type
create table everything.base (
  created_at timestamp default now(),
  updated_at timestamp default now()
);
comment on table everything.base is E'@omit create,update,delete';

-- create user + auth types
create table everything.user (
  id text not null,
  primary key (id)
) inherits (everything.base);
comment on table everything.user is E'@omit create,update';

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
  description text
) inherits (everything.base);
comment on table everything.category is E'@omit create';

-- create subcategory, attribute, and option
create table everything.subcategory (
  id serial primary key,
  category_id int not null references everything.category(id) on delete cascade,
  name text not null check (char_length(name) < 80),
  description text,
  unique(category_id, name)
) inherits (everything.base);
create index on everything.subcategory (category_id);

create table everything.attribute (
  id serial primary key,
  name text not null check (char_length(name) < 80) unique,
  description text,
  type everything.option_type
) inherits (everything.base);
comment on table everything.attribute is E'@omit create';

create table everything.option (
  id serial primary key,
  value text not null check (char_length(value) < 80),
  type everything.option_type
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

-- create item
create table everything.item (
  id serial primary key,
  category_id int not null references everything.category(id) on delete cascade,
  subcategory_id int not null references everything.subcategory(id) on delete cascade,
  owner_id text not null references everything.user(id) on delete cascade,
  media text [],
  quantity int not null default 1,
  is_request boolean not null default false,
  metadata json
) inherits (everything.base);
comment on table everything.item is E'@omit create,update';
create index on everything.item (category_id);
create index on everything.item (subcategory_id);
create index on everything.item (owner_id);

-- create characteristic
create table everything.characteristic (
  item_id int references everything.item(id) on delete cascade,
  attribute_id int references everything.attribute(id) on delete cascade,
  option_id int references everything.option(id) on delete cascade,
  num_approvals int not null default 0,
  is_validated bool not null default false,
  initial_value text not null,
  primary key (item_id, attribute_id, option_id)
) inherits (everything.base);
create index on everything.characteristic (item_id);
create index on everything.characteristic (attribute_id);
create index on everything.characteristic (option_id);

-- create roles
create role everything_postgraphile login password 'anything-postgraphile';
create role everything_anon;
create role everything_user;
create role everything_admin;

-- grant relationships
grant everything_anon to everything_user;
grant everything_user to everything_admin;
grant everything_admin to everything_postgraphile;

-- grant privileges
alter default privileges revoke execute on functions from public;
-- to schema
grant usage on schema everything to everything_anon;
-- to users & auth types
grant select on table everything.user to everything_user;
grant select on table everything.invite to everything_anon;
grant insert on table everything.invite to everything_anon;
grant delete on table everything.invite to everything_admin;
-- to labels
grant select on table everything.category to everything_user;
grant insert,update,delete on table everything.category to everything_admin;
grant select on table everything.subcategory to everything_user;
grant insert,update,delete on table everything.subcategory to everything_admin;
grant select on table everything.attribute to everything_user;
grant insert,update,delete on table everything.attribute to everything_admin;
grant select,insert on table everything.option to everything_user;
grant update,delete on table everything.option to everything_admin;
grant select on table everything.association to everything_user;
grant insert,update,delete on table everything.association to everything_admin;
grant select on table everything.relationship to everything_user;
grant insert,update,delete on table everything.relationship to everything_admin;
-- to items
grant select on table everything.item to everything_user;
grant insert,update on table everything.item to everything_user;
grant delete on table everything.item to everything_admin;
grant select,insert,update on table everything.characteristic to everything_user;
-- RLS 
-- users & auth types
alter table everything.user enable row level security;
create policy select_user on everything.user for select
  using (true);

create policy update_user on everything.user for update to everything_user
  using (id = nullif(current_setting('jwt.claims.firebase.id', true), '')::text);

create policy delete_user on everything.user for delete to everything_user
  using (id = nullif(current_setting('jwt.claims.firebase.id', true), '')::text);

-- create functions
-- updated_at
create function everything_private.set_updated_at() returns trigger as $$
begin
  new.updated_at := current_timestamp;
  return new;
end;
$$ language plpgsql;

-- create triggers
create trigger base_updated_at before update
  on everything.base
  for each row
  execute procedure everything_private.set_updated_at();