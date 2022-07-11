begin;

-- create schemas
create schema everything;
create schema everything_private;

-- create types
create type everything.option_type as enum ('text', 'company', 'size');

-- create user + auth types
create table everything.user (
  id text not null, -- the id will match uid from firebase (is this text? var char?)
  created_at timestamp default now(),
  primary key (id)
);
comment on table everything.user is E '@omit create,update,delete';

create table everything.invite (
  phone_number text not null,
  -- verify phone number? check (char_length(phone_number) = 12)?
  is_approved boolean default false,
  primary key (phone_number)
);
comment on table everything.invite is E '@omit update,delete';

-- create labels
create table everything.category (
  id serial primary key,
  name text not null check (char_length(name) < 80) unique,
  description text,
  created_at timestamp default now()
);
comment on table everything.category is E '@omit create,delete';

create table everything.subcategory (
  id serial primary key,
  category_id int not null references everything.category(id),
  name text not null check (char_length(name) < 80),
  description text,
  created_at timestamp default now(),
  unique(category_id, name)
);
comment on table everything.subcategory is E '@omit delete';

create table everything.attribute (
  id serial primary key,
  name text not null check (char_length(name) < 80) unique,
  description text,
  type everything.option_type,
  created_at timestamp default now(),
);
comment on table everything.attribute is E '@omit create,delete';

create table everything.option (
  id serial primary key,
  value text not null check (char_length(value) < 80),
  type everything.option_type,
  created_at timestamp default now()
);
comment on table everything.option is E '@omit delete';

create table everything.association (
  subcategory_id int references everything.subcategory(id),
  attribute_id int references everything.attribute(id),
  created_at timestamp default now(),
  primary key (subcategory_id, attribute_id)
);
comment on table everything.association is E '@omit update';

create table everything.relationship (
  attribute_id int references everything.attribute(id),
  option_id int references everything.option(id),
  created_at timestamp default now(),
  primary key (attribute_id, option_id)
);
comment on table everything.relationship is E '@omit update';

-- create item
create table everything.item (
  id serial primary key,
  category_id int not null references everything.category(id),
  subcategory_id int not null references everything.subcategory(id),
  media text [],
  metadata json,
  created_at timestamp default now()
);
comment on table everything.item is E '@omit create,update,delete';

create table everything.item_characteristic (
  item_id int references everything.item(id),
  attribute_id int references everything.attribute(id),
  option_id int references everything.option(id),
  num_approvals int not null default 0,
  is_validated bool not null default false,
  initial_value text not null,
  created_at timestamp default now(),
  primary key (item_id, attribute_id, option_id)
);

-- create request
create table everything.request (
  id serial primary key,
  category_id int not null references everything.category(id),
  subcategory_id int not null references everything.subcategory(id),
  requester_id int not null references everything.user(id),
  media text [],
  metadata json,
  created_at timestamp default now()
);
comment on table everything.request is E '@omit create,update,delete';


create table everything.request_characteristic (
  request_id int references everything.request(id),
  attribute_id int references everything.attribute(id),
  option_id int references everything.option(id),
  initial_value text not null,
  created_at timestamp default now(),
  primary key (request_id, attribute_id, option_id)
);

-- create roles
create role everything_postgraphile login password 'anything-postgraphile';
create role everything_anon;
create role everything_user;
grant everything_anon to everything_user;
create role everything_admin;
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
grant select,insert,update on table everything.item_characteristic to everything_user;
-- RLS 
-- users & auth types
alter table everything.user enable row level security
create policy select_user on everything.user for select
  using (true);

commit;