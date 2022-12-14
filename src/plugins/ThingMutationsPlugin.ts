// @ts-nocheck
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const fs = require("fs");

const ThingMutationsPlugin = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input NewCharacteristicInput {
        attributeId: Int!
        optionId: Int!
      }

      # input NewCharacteristicInput {
      #   attributeId: Int!
      #   optionValue: String!
      # }

      input CreateThingInput {
        thingId: String!
        characteristics: [NewCharacteristicInput!]!
        ownerId: String!
      }

      # input CreateThingBulkInput {
      #   characteristics: [NewCharacteristicInput!]!
      #   ownerId: String!
      #   privacyType: PrivacyType!
      # }

      type CreateThingPayload {
        thing: Thing @pgField
        query: Query
      }

      extend type Mutation {
        createThing(input: CreateThingInput!): CreateThingPayload
        # createThingBulkUpload(input: CreateThingBulkInput!): CreateThingPayload
      }
    `,
    resolvers: {
      Mutation: {
        createThing: async (_query, args, context, resolveInfo) => {
          const { pgClient } = context;
          const {
            thingId,
            ownerId,
            characteristics,
          } = args.input;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");
          try {
            // create the thing
            const {
              rows: [thing],
            } = await pgClient.query(
              `INSERT INTO everything.thing(id, owner_id) VALUES ($1, $2)              RETURNING *`,
              [
                thingId,
                ownerId,
              ]
            ); // TODO : create a postgres function that automatically sets creator_id on creation
            // create characteristics
            await Promise.all(
              characteristics.map(async (char) => {
                // create the option (regular text)
                await pgClient.query(
                  `INSERT INTO everything.characteristic(                thing_id, attribute_id, option_id              ) VALUES ($1, $2, $3)              RETURNING *`,
                  [thing.id, char.attributeId, char.optionId]
                );
              })
            );      
            // get and return the updated thing
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
      //   createThingBulkUpload: async (_query, args, context, resolveInfo) => {
      //     const { pgClient } = context;
      //     const {
      //       ownerId,
      //       characteristics,
      //       privacyType,
      //     } = args.input;
      //     // Start a sub-transaction
      //     await pgClient.query("SAVEPOINT graphql_mutation");
      //     try {
      //       // create the thing
      //       const {
      //         rows: [thing],
      //       } = await pgClient.query(
      //         `INSERT INTO everything.thing(                owner_id, origin_app_id, privacy_type              ) VALUES ($1, $2, $3)              RETURNING *`,
      //         [
      //           ownerId,
      //           1,
      //           privacyType
      //         ]
      //       );
      //       // create the characteristics using the thing id
      //       // await Promise.all(
      //       //   characteristics.map(async (char) => {
      //       //     let optionId;
      //       //     // check if option exists from value
      //       //     const [row] =
      //       //       await resolveInfo.graphile.selectGraphQLResultFromTable(
      //       //         sql.fragment`everything.option`,
      //       //         (tableAlias, queryBuilder) => {
      //       //           queryBuilder.where(
      //       //             sql.fragment`${tableAlias}.value = ${sql.value(char.optionValue)}`
      //       //           );
      //       //         }
      //       //       );
      //       //     // if exists
      //       //     if (row) {
      //       //       optionId = row.id
      //       //     } else {
      //       //       // create option
      //       //       const {
      //       //         rows: [option],
      //       //       } = await pgClient.query(
      //       //         `INSERT INTO everything.option(                value          ) VALUES ($1)              RETURNING *`,
      //       //         [char.optionValue]
      //       //       );
      //       //       optionId = option.id
      //       //       // create relationship
      //       //       const {
      //       //         rows: [relationship],
      //       //       } = await pgClient.query(
      //       //         `INSERT INTO everything.relationship(                attribute_id, option_id              ) VALUES ($1, $2)              RETURNING *`,
      //       //         [char.attributeId, option.id]
      //       //       );
      //       //     }
      //       //     // create the characteristic
      //       //     await pgClient.query(
      //       //       `INSERT INTO everything.characteristic(                thing_id, attribute_id, option_id              ) VALUES ($1, $2, $3)              RETURNING *`,
      //       //       [thing.id, char.attributeId, optionId]
      //       //     );
      //       //   })
      //       // );
      //       // get and return the updated thing
      //       const [row] =
      //         await resolveInfo.graphile.selectGraphQLResultFromTable(
      //           sql.fragment`everything.thing`,
      //           (tableAlias, queryBuilder) => {
      //             queryBuilder.where(
      //               sql.fragment`${tableAlias}.id = ${sql.value(thing.id)}`
      //             );
      //           }
      //         );
      //       return {
      //         data: row,
      //         query: build.$$isQuery,
      //       };
      //     } catch (e) {
      //       // mutation failed, abort
      //       await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
      //       throw e;
      //     } finally {
      //       // Release our savepoint so it doesn't conflict with other mutations
      //       await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
      //     }
      //   },
      },
    },
  };
});

export default ThingMutationsPlugin;
