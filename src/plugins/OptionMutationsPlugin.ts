// @ts-nocheck
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");

const OptionMutationsPlugin = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input ProposeOptionInput {
        value: String!
        attributeId: Int!
      }

      type ProposeOptionPayload {
        option: Option @pgField
        query: Query
      }

      extend type Mutation {
        proposeOption(input: ProposeOptionInput!): ProposeOptionPayload
      }
    `,
    resolvers: {
      Mutation: {
        proposeOption: async (_query, args, context, resolveInfo) => {
          const { pgClient } = context;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");
          try {
            // Propose the option
            const {
              rows: [option],
            } = await pgClient.query(
              `INSERT INTO everything.option(                value          ) VALUES ($1)              RETURNING *`,
              [args.input.value]
            );
            // create the relationship
            const {
              rows: [relationship],
            } = await pgClient.query(
              `INSERT INTO everything.relationship(                attribute_id, option_id              ) VALUES ($1, $2)              RETURNING *`,
              [args.input.attributeId, option.id]
            );
            // get the option
            const [row] =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`everything.option`,
                (tableAlias, queryBuilder) => {
                  queryBuilder.where(
                    sql.fragment`${tableAlias}.id = ${sql.value(option.id)}`
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

export default OptionMutationsPlugin;
