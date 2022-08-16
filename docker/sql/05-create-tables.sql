\c everything admin
-- create types
create type everything.option_type as enum ('text', 'company', 'size');
create type everything.feedback_type as enum ('question', 'concern', 'help', 'idea', 'other');
-- create base type
create table everything.base (
  created_at timestamp default now(),
  updated_at timestamp default now()
);
comment on table everything.base is E'@omit';

-- create user + auth types
create table everything.user (
  id text not null,
  username text unique,
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
  name text not null check (char_length(name) < 33) unique,
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
  nft_id text,
  media text [],
  quantity int not null default 1,
  metadata json,
  geom_point everything.geometry(Point, 4326) default null
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

-- create feedback
create table everything.feedback (
  id serial primary key,
  description text not null,
  type everything.feedback_type not null,
  user_id text not null references everything.user(id)
) inherits (everything.base);
comment on table everything.feedback is E'@omit delete';
create index on everything.feedback (user_id);