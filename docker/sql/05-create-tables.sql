\c everything admin
-- create types
create type everything.privacy_type as enum ('private', 'friends', 'public');
-- create base type
create table everything.base (
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);
comment on table everything.base is E'@omit';

-- create user + auth types
create table everything.user (
  id text not null,
  username public.citext unique,
  name text,
  favorite_color text,
  wallet text unique,
  metadata jsonb,
  primary key (id),
  CONSTRAINT user_username_check CHECK (((length((username)::text) >= 2) AND (length((username)::text) <= 24) AND (username OPERATOR(public.~) '^[a-zA-Z]([_]?[a-zA-Z0-9])+$'::public.citext)))
) inherits (everything.base);
comment on table everything.user is E'@omit create,update,delete';

-- create app
-- create table everything.app (
--   id serial primary key,
--   metadata jsonb
-- ) inherits (everything.base);

-- create location
-- create table everything.location (
--   id serial primary key,
--   geom_point public.geometry(Point, 4326) not null,
--   metadata jsonb
-- ) inherits (everything.base);

-- create thing
create table everything.thing (
  id text not null primary key,
  owner_id text not null,
  metadata jsonb,
  privacy_type everything.privacy_type
) inherits (everything.base);
comment on table everything.thing is E'@omit create,update,delete';
create index on everything.thing (id);
create index on everything.thing (owner_id);
create index on everything.thing (privacy_type);

-- create media and tag
create table everything.media (
  id serial primary key,
  media_url text not null,
  metadata jsonb,
  CONSTRAINT media_url_check CHECK ((media_url ~ '^https?://[^/]+'::text))
) inherits (everything.base);
comment on table everything.media is E'@omit create,update,delete';

create table everything.tag (
  thing_id text references everything.thing(id) on delete cascade,
  media_id int references everything.media(id) on delete cascade,
  primary key (thing_id, media_id)
) inherits (everything.base);
comment on table everything.tag is E'@omit create,update,delete';
create index on everything.tag (thing_id);
create index on everything.tag (media_id);

-- create labels
create table everything.attribute (
  id serial primary key,
  name text not null check (char_length(name) < 80) unique,
  is_approved boolean default false
) inherits (everything.base);
comment on table everything.attribute is E'@omit create,update,delete';

create table everything.option (
  id serial primary key,
  value text not null check (char_length(value) < 80),
  is_approved boolean default false
) inherits (everything.base);
comment on table everything.option is E'@omit create,update,delete';

-- create relationships
create table everything.relationship (
  attribute_id int references everything.attribute(id) on delete cascade,
  option_id int references everything.option(id) on delete cascade,
  primary key (attribute_id, option_id)
) inherits (everything.base);
comment on table everything.relationship is E'@omit create,update,delete';
create index on everything.relationship (attribute_id);
create index on everything.relationship (option_id);

-- create characteristic
create table everything.characteristic (
  thing_id text references everything.thing(id) on delete cascade,
  attribute_id int references everything.attribute(id) on delete cascade,
  option_id int references everything.option(id) on delete cascade,
  primary key (thing_id, attribute_id, option_id)
) inherits (everything.base);
comment on table everything.characteristic is E'@omit create,update,delete';
create index on everything.characteristic (thing_id);
create index on everything.characteristic (attribute_id);
create index on everything.characteristic (option_id);