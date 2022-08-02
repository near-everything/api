\c everything admin
-- create triggers
create trigger base_updated_at before update
  on everything.base
  for each row
  execute procedure everything_private.set_updated_at();

create trigger category_created_by before insert
  on everything.category
  for each row
  execute procedure everything_private.set_created_by();