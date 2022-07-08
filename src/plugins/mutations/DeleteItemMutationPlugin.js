const { makeExtendSchemaPlugin, gql } = require("graphile-utils");

const DeleteItemMutationPlugin = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input DeleteItemInput {
        itemId: Int!
      }

      type DeleteItemPayload {
        deletedItemId: Int
        query: Query
      }

      extend type Mutation {
        deleteItem(input: DeleteItemInput!): DeleteItemPayload
      }
    `,
    resolvers: {
      Mutation: {
        deleteItem: async (_query, args, context, resolveInfo) => {
          const { pgClient } = context;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");
          try {
            // delete all the characteristics using the item id
            await pgClient.query(
              `DELETE FROM everything.item_characteristic WHERE item_id = $1`,
              [args.input.itemId]
            );
            await pgClient.query(
              `DELETE FROM everything.item WHERE id = $1`,
              [args.input.itemId]
            );              
            return {
              data: args.input.itemId,
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

module.exports = DeleteItemMutationPlugin;
