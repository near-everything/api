const { makeExtendSchemaPlugin, gql } = require("graphile-utils");

const CreateAttributeMutationPlugin = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input CreateAssociationForAttributeInput {
        subcategoryId: Int!
      }

      input CreateAttributeInput  {
        name: String!
        type: String!,
        description: String, 
        associations: [CreateAssociationForAttributeInput!]!
        options: [CreateOptionInput!]!
      }

      type CreateAttributePayload {
        attribute: Attribute @pgField
        query: Query
      }

      extend type Mutation {
        createAttribute(input: CreateAttributeInput!): CreateAttributePayload
      }
    `,
    resolvers: {
      Mutation: {
        createAttribute: async (_query, args, context, resolveInfo) => {
          const { pgClient } = context;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");
          try {
            // create the attribute
            const {
              rows: [attribute],
            } = await pgClient.query(
              `INSERT INTO everything.attribute(                name, type, description              ) VALUES ($1, $2, $3)              RETURNING *`,
              [
                args.input.name,
                args.input.type, 
                args.input.description,
              ]
            );
            // create all the associations using the attribute id
            await Promise.all(
              args.input.associations.map(async (association) => {
                await pgClient.query(
                  `INSERT INTO everything.association(                subcategory_id, attribute_id              ) VALUES ($1, $2)              RETURNING *`,
                  [association.subcategoryId, attribute.id]
                );
              })
            );
            // create all the options and relationships
            await Promise.all(
              args.input.options.map(async (option) => {
                const { rows: [newOption] } = await pgClient.query(
                  `INSERT INTO everything.option(                value, type             ) VALUES ($1, $2)              RETURNING *`,
                  [option.option.value, option.option.type]
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
    },
  };
});

module.exports = CreateAttributeMutationPlugin;
