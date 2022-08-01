const { makeExtendSchemaPlugin, gql } = require("graphile-utils");

const CreateThingMutationPlugin = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input NewAttributeInput {
        attributeId: Int!
        optionId: Int!
      }

      input CreateThingInput {
        categoryId: Int!
        subcategoryId: Int!
        attributes: [NewAttributeInput!]!
        media: [String!]!
        ownerId: String!,
        quantity: Int,
        geomPoint: GeoJSON
      }

      type CreateThingPayload {
        thing: Thing @pgField
        query: Query
      }

      extend type Mutation {
        createThing(input: CreateThingInput!): CreateThingPayload
      }
    `,
    resolvers: {
      Mutation: {
        createThing: async (_query, args, context, resolveInfo) => {
          const { pgClient } = context;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");
          try {
            // create the thing
            const {
              rows: [thing],
            } = await pgClient.query(
              `INSERT INTO everything.thing(                category_id, subcategory_id, owner_id, media, quantity, geom_point              ) VALUES ($1, $2, $3, $4, $5, $6)              RETURNING *`,
              [
                args.input.categoryId,
                args.input.subcategoryId,
                args.input.ownerId,
                args.input.media,
                args.input.quantity || 1,
                args.input.geomPoint
              ]
            );
            // create all the characteristics using the thing id
            await Promise.all(
              args.input.attributes.map(async (attribute) => {
                // create the option (regular text)
                await pgClient.query(
                  `INSERT INTO everything.characteristic(                thing_id, attribute_id, option_id              ) VALUES ($1, $2, $3)              RETURNING *`,
                  [
                    thing.id,
                    attribute.attributeId,
                    attribute.optionId,
                  ]
                );
              })
            );
            // get the thing
            const [row] =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`everything.thing`,
                (tableAlias, queryBuilder) => {
                  queryBuilder.where(
                    sql.fragment`${tableAlias}.id = ${sql.value(thing.id)}`
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

module.exports = CreateThingMutationPlugin;
