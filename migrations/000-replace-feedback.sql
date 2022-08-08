-- CREATE
create type everything.feedback_type as enum ('question', 'concern', 'help', 'idea', 'other');
-- create feedback
create table everything.feedback (
  id serial primary key,
  description text not null,
  type everything.feedback_type not null,
  user_id text not null references everything.user(id)
) inherits (everything.base);
comment on table everything.feedback is E'@omit delete';
create index on everything.feedback (user_id);

grant usage, select on all sequences in schema everything to everything_anon;

grant select,insert on table everything.feedback to everything_user;
grant delete on table everything.feedback to everything_admin;


-- DELETE

drop table everything.help;
drop table everything.concern;
drop table everything.idea;
drop table everything.question;