const { makeExtendSchemaPlugin, gql } = require("graphile-utils");

const CreateItemMutationPlugin = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input NewAttributeInput {
        attributeId: Int!
        initialValue: String!
      }

      input CreateItemInput {
        categoryId: Int!
        subcategoryId: Int!
        attributes: [NewAttributeInput!]!
        media: [String!]!
        ownerId: String!,
        quantity: Int,
        isRequest: Boolean
      }

      type CreateItemPayload {
        item: Item @pgField
        query: Query
      }

      extend type Mutation {
        createItem(input: CreateItemInput!): CreateItemPayload
      }
    `,
    resolvers: {
      Mutation: {
        createItem: async (_query, args, context, resolveInfo) => {
          const { pgClient } = context;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");
          try {
            // create the item
            const {
              rows: [item],
            } = await pgClient.query(
              `INSERT INTO everything.item(                category_id, subcategory_id, owner_id, media, quantity, is_request              ) VALUES ($1, $2, $3, $4, $5, $6)              RETURNING *`,
              [
                args.input.categoryId,
                args.input.subcategoryId,
                args.input.ownerId,
                args.input.media,
                args.input.quantity || 1,
                args.input.isRequest || false,
              ]
            );
            // create all the characteristics using the item id
            await Promise.all(
              args.input.attributes.map(async (attribute) => {
                // create the option (regular text)
                const {
                  rows: [option],
                } = await pgClient.query(
                  `INSERT INTO everything.option( value, type ) VALUES ($1, $2) RETURNING *`,
                  [attribute.initialValue, 'text']
                );
                await pgClient.query(
                  `INSERT INTO everything.characteristic(                item_id, attribute_id, option_id, initial_value              ) VALUES ($1, $2, $3, $4)              RETURNING *`,
                  [
                    item.id,
                    attribute.attributeId,
                    option.id,
                    attribute.initialValue,
                  ]
                );
              })
            );
            // get the item
            const [row] =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`everything.item`,
                (tableAlias, queryBuilder) => {
                  queryBuilder.where(
                    sql.fragment`${tableAlias}.id = ${sql.value(item.id)}`
                  );
                }
              );
            return {
              data: row,
              query: build.$$isQuery,
            };
          } catch (e) {
            // mutation failed, abort
            await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
            throw e;
          } finally {
            // Release our savepoint so it doesn't conflict with other mutations
            await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
          }
        },
      },
    },
  };
});

module.exports = CreateItemMutationPlugin;
