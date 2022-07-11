
begin;

create schema everything;
create schema everything_private;

create type everything.option_type as enum ('text', 'company', 'size');

-- the id will match uid from firebase (is this text? var char?)
create table everything.user (
  id                text not null, 
  created_at        timestamp default now(),
  primary key (id)
);

create table everything.invite (
  phone_number       text not null, -- verify phone number? check (char_length(phone_number) = 12)?
  is_approved        boolean default false,
  primary key (phone_number)
);

create table everything.category (
	id 				        serial primary key,
	name			        text not null check (char_length(name) < 80) unique,
  description       text,
  created_at        timestamp default now()
);

comment on table everything.category is E'@omit create';

create table everything.subcategory (
	id 	              serial primary key,
  category_id       int not null references everything.category(id),
	name			        text not null check (char_length(name) < 80),
  description       text,
  created_at        timestamp default now(),
  unique(category_id, name)
);

create table everything.attribute (
	id 	              serial primary key,
	name			        text not null check (char_length(name) < 80) unique,
  description       text,
  type              everything.option_type,
  created_at        timestamp default now(),
);

alter table everything.attribute
add column type              everything.option_type;

comment on table everything.attribute is E'@omit create';

create table everything.option (
	id 	              serial primary key,
	value			        text not null check (char_length(value) < 80),
  type              everything.option_type,
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
  media             text[],
  metadata          json,
  created_at        timestamp default now()
);

comment on table everything.item is E'@omit create,update,delete';

create table everything.request (
	id 				        serial primary key,
	category_id		    int not null references everything.category(id),
	subcategory_id		int not null references everything.subcategory(id),
  requester_id      int not null references everything.user(id),
  media             text[],
  metadata          json,
  created_at        timestamp default now()
);

comment on table everything.request is E'@omit create,update';

create table everything.item_characteristic (
  item_id           int references everything.item(id),
  attribute_id      int references everything.attribute(id),
  option_id         int references everything.option(id),
  num_approvals     int not null default 0,
  is_validated      bool not null default false,
  initial_value     text not null,
  created_at        timestamp default now(),
  primary key (item_id, attribute_id, option_id)
);

create table everything.request_characteristic (
  request_id           int references everything.request(id),
  attribute_id      int references everything.attribute(id),
  option_id         int references everything.option(id),
  initial_value     text not null,
  created_at        timestamp default now(),
  primary key (request_id, attribute_id, option_id)
);




