
begin;

create schema everything;
-- do I want to create schema labels?
create schema everything_private;

create table everything.user (
  id                serial primary key, -- uuid?
  created_at        timestamp default now()
);

create table everything.invite (
  phone_number       text not null check (char_length(phone_number) = 12),
  is_approved        boolean default false,
  primary key (phone_number)
)

create table everything.category (
	id 				        serial primary key,
	name			        text not null check (char_length(name) < 80) unique,
  description       text,
  created_at        timestamp default now()
);

create table everything.subcategory (
	id 	              serial primary key,
  category_id       int not null references everything.category(id),
	name			        text not null check (char_length(name) < 80) unique,
  description       text,
  created_at        timestamp default now()
);

create table everything.attribute (
	id 	              serial primary key,
	name			        text not null check (char_length(name) < 80) unique,
  description       text,
  metadata          json,
  created_at        timestamp default now()
);

create table everything.option (
	id 	              serial primary key,
	value			        text not null check (char_length(value) < 80) unique,
  created_at        timestamp default now()
);

create table everything.association (
	subcategory_id    int references everything.subcategory(id),
  attribute_id      int references everything.attribute(id),
  created_at        timestamp default now(),
  primary key (subcategory_id, attribute_id)
);

create table everything.relationship (
  attribute_id      int references everything.attribute(id),
  option_id         int references everything.option(id),
  created_at        timestamp default now(),
  primary key (attribute_id, option_id)
);

create table everything.item (
	id 				        serial primary key,
	category_id		    int not null references everything.category(id),
	subcategory_id		int not null references everything.subcategory(id),
  owner_id          int not null references everything.user(id),
  media             text[]
  metadata          json,
  created_at        timestamp default now()
);

comment on table everything.item is E'@omit create,update';

create table everything.characteristic (
  item_id           int references everything.item(id),
  attribute_id      int references everything.attribute(id),
  option_id         int references everything.option(id),
  initial_value     text not null,
  created_at        timestamp default now(),
  primary key (item_id, attribute_id, option_id)
);




