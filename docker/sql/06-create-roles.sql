\c everything
create role everything_postgraphile login password 'anything-postgraphile';
create role everything_anon; -- not logged in
create role everything_user; -- logged in
create role everything_app; -- application
create role everything_admin;

-- grant relationships
grant everything_anon to everything_user;
grant everything_user to everything_admin;
grant everything_app to everything_admin;
grant everything_admin to everything_postgraphile;