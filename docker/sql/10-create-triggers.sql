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

  create trigger subcategory_created_by before insert
  on everything.subcategory
  for each row
  execute procedure everything_private.set_created_by();

  create trigger attribute_created_by before insert
  on everything.attribute
  for each row
  execute procedure everything_private.set_created_by();

  create trigger option_created_by before insert
  on everything.option
  for each row
  execute procedure everything_private.set_created_by();

  create trigger association_created_by before insert
  on everything.association
  for each row
  execute procedure everything_private.set_created_by();

  create trigger relationship_created_by before insert
  on everything.relationship
  for each row
  execute procedure everything_private.set_created_by();

  create trigger thing_created_by before insert
  on everything.thing
  for each row
  execute procedure everything_private.set_created_by();

  create trigger request_created_by before insert
  on everything.request
  for each row
  execute procedure everything_private.set_created_by();

  create trigger characteristic_created_by before insert
  on everything.characteristic
  for each row
  execute procedure everything_private.set_created_by();

  create trigger help_created_by before insert
  on everything.help
  for each row
  execute procedure everything_private.set_created_by();

  create trigger idea_created_by before insert
  on everything.idea
  for each row
  execute procedure everything_private.set_created_by();

  create trigger concern_created_by before insert
  on everything.concern
  for each row
  execute procedure everything_private.set_created_by();

  create trigger question_created_by before insert
  on everything.question
  for each row
  execute procedure everything_private.set_created_by();