\c everything
create extension if not exists postgis with schema public;
COMMENT ON EXTENSION postgis IS 'generate geo points for locations';

create extension if not exists citext with schema public;
COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';