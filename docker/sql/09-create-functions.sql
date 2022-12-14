\c everything admin
-- create functions (functions are private)
-- updated_at
create function everything_private.set_updated_at() returns trigger as $$
begin
  new.updated_at := current_timestamp;
  return new;
end;
$$ language plpgsql;

-- created_by
-- create function everything_private.set_created_by() returns trigger as $$
-- begin
--   new.created_by := current_setting('jwt.claims.firebase');
--   return new;
-- end;
-- $$ language plpgsql;