\c everything admin
-- RLS 
-- users & auth types
alter table everything.user enable row level security;
-- any user can see other users
create policy select_user on everything.user for select to everything_user
  using (true);
-- anon can create user
create policy insert_user on everything.user for insert to everything_anon
  with check (true);
-- -- only the user themself can update their own record
-- create policy update_user on everything.user for update to everything_user
--   using (id = nullif(current_setting('jwt.claims.firebase', true), '')::text);
-- -- only the user themself can delete their own record
-- create policy delete_user on everything.user for delete to everything_user
--   using (id = nullif(current_setting('jwt.claims.firebase', true), '')::text);