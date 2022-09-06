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
-- to app
grant select on table everything.app to everything_user;
grant select,update on table everything.app to everything_app;
grant insert,delete on table everything.app to everything_admin;
-- to location
grant select,insert on table everything.location to everything_user;
grant update,delete on table everything.location to everything_admin;
-- to things
grant select,insert,update on table everything.thing to everything_user;
grant select,insert,update on table everything.thing to everything_app;
grant delete on table everything.thing to everything_admin;
-- to requests
grant select,insert,update on table everything.request to everything_user;
grant delete on table everything.request to everything_admin;
-- to posts
grant select,insert,update,delete on table everything.post to everything_user;
grant select,insert,update,delete on table everything.post to everything_app;
-- to comments
grant select,insert,update,delete on table everything.comment to everything_user;
grant select,insert,update,delete on table everything.comment to everything_app;
-- to media
grant select,insert,update,delete on table everything.media to everything_user;
grant select,insert,update,delete on table everything.media to everything_app;
-- to tags
grant select,insert,update,delete on table everything.thing_tag to everything_user;
grant select,insert,update,delete on table everything.thing_tag to everything_app;

grant select,insert,update,delete on table everything.user_tag to everything_user;
grant select,insert,update,delete on table everything.user_tag to everything_app;
-- to labels
grant select,insert on table everything.attribute to everything_user;
grant select,insert on table everything.attribute to everything_app;
grant update,delete on table everything.attribute to everything_admin;

grant select,insert on table everything.option to everything_user;
grant select,insert on table everything.option to everything_app;
grant update,delete on table everything.option to everything_admin;

grant select,insert on table everything.relationship to everything_user;
grant select,insert on table everything.relationship to everything_app;
grant update,delete on table everything.relationship to everything_admin;

grant select,insert,update on table everything.characteristic to everything_user;
grant select,insert,update on table everything.characteristic to everything_app;

