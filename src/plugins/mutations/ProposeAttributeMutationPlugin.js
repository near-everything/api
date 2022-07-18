const { makeExtendSchemaPlugin, gql } = require("graphile-utils");

const ProposeAttributeMutationPlugin = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input ProposeAttributeInput  {
        name: String!
      }

      type ProposeAttributePayload {
        attribute: Attribute @pgField
        query: Query
      }

      extend type Mutation {
        proposeAttribute(input: ProposeAttributeInput!): ProposeAttributePayload
      }
    `,
    resolvers: {
      Mutation: {
        proposeAttribute: async (_query, args, context, resolveInfo) => {
          const { pgClient } = context;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");
          try {
            // Propose the attribute
            const {
              rows: [attribute],
            } = await pgClient.query(
              `INSERT INTO everything.attribute(                name, type, is_proposal              ) VALUES ($1, $2, $3)              RETURNING *`,
              [
                args.input.name,
                'text',
                true,
              ]
            );
            // get the attribute
            const [row] =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`everything.attribute`,
                (tableAlias, queryBuilder) => {
                  queryBuilder.where(
                    sql.fragment`${tableAlias}.id = ${sql.value(attribute.id)}`
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

module.exports = ProposeAttributeMutationPlugin;
