\c everything admin
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