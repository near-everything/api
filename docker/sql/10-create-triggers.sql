\c everything admin
-- create triggers
create trigger base_updated_at before update
  on everything.base
  for each row
  execute procedure everything_private.set_updated_at();

  -- create trigger attribute_created_by before insert
  -- on everything.attribute
  -- for each row
  -- execute procedure everything_private.set_created_by();

  -- create trigger option_created_by before insert
  -- on everything.option
  -- for each row
  -- execute procedure everything_private.set_created_by();

  -- create trigger relationship_created_by before insert
  -- on everything.relationship
  -- for each row
  -- execute procedure everything_private.set_created_by();

  -- create trigger thing_created_by before insert
  -- on everything.thing
  -- for each row
  -- execute procedure everything_private.set_created_by();

  -- create trigger request_created_by before insert
  -- on everything.request
  -- for each row
  -- execute procedure everything_private.set_created_by();

  -- create trigger characteristic_created_by before insert
  -- on everything.characteristic
  -- for each row
  -- execute procedure everything_private.set_created_by();