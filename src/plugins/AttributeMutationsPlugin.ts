// @ts-nocheck
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
import { OurGraphQLContext } from "../middleware/installPostGraphile";


const AttributeMutationsPlugin = makeExtendSchemaPlugin(build => {
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

      input CreateAssociationForAttributeInput {
        subcategoryId: Int!
      }

      input CreateAttributeInput  {
        name: String!
        options: [CreateOptionInput!]!
      }

      type CreateAttributePayload {
        attribute: Attribute @pgField
        query: Query
      }

      extend type Mutation {
        proposeAttribute(input: ProposeAttributeInput!): ProposeAttributePayload
        createAttribute(input: CreateAttributeInput!): CreateAttributePayload
      }
    `,
    resolvers: {
      Mutation: {
        proposeAttribute: async (_query, args, context: OurGraphQLContext, resolveInfo) => {
          const { pgClient } = context;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");
          try {
            // Propose the attribute
            const {
              rows: [attribute],
            } = await pgClient.query(
              `INSERT INTO everything.attribute(                name              ) VALUES ($1)              RETURNING *`,
              [args.input.name]
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
      createAttribute: async (_query, args, context, resolveInfo) => {
        const { pgClient } = context;
        // Start a sub-transaction
        await pgClient.query("SAVEPOINT graphql_mutation");
        try {
          // create the attribute
          const {
            rows: [attribute],
          } = await pgClient.query(
            `INSERT INTO everything.attribute(                name              ) VALUES ($1)              RETURNING *`,
            [
              args.input.name
            ]
          );
          // create all the options and relationships
          await Promise.all(
            args.input.options.map(async (option) => {
              const { rows: [newOption] } = await pgClient.query(
                `INSERT INTO everything.option(                value            ) VALUES ($1)              RETURNING *`,
                [option.option.value]
              );
              await pgClient.query(
                `INSERT INTO everything.relationship(                attribute_id, option_id              ) VALUES ($1, $2)              RETURNING *`,
                [attribute.id, newOption.id]
              );
            })
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
  };
});

export default AttributeMutationsPlugin;
