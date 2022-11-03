// @ts-nocheck
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
// const api = require("../utils/near/api");
const fs = require("fs");

// const settings = JSON.parse(fs.readFileSync(api.CONFIG_PATH, "utf8"));

const ThingMutationsPlugin = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input NewAttributeInput {
        attributeId: Int!
        optionId: Int!
      }

      input CreateThingInput {
        attributes: [NewAttributeInput!]!
        ownerId: String!
        geomPoint: GeoJSON
        privacyType: PrivacyType!
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
          const {
            ownerId,
            attributes,
            privacyType,
          } = args.input;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");        
          try {           
            // create the thing
            const {
              rows: [thing],
            } = await pgClient.query(
              `INSERT INTO everything.thing(                owner_id, origin_app_id, privacy_type              ) VALUES ($1, $2, $3)              RETURNING *`,
              [
                ownerId,
                1,
                privacyType
              ]
            );
            // create the characteristics using the thing id
            await Promise.all(
              attributes.map(async (attribute) => {
                // create the option (regular text)
                await pgClient.query(
                  `INSERT INTO everything.characteristic(                thing_id, attribute_id, option_id              ) VALUES ($1, $2, $3)              RETURNING *`,
                  [thing.id, attribute.attributeId, attribute.optionId]
                );
              })
            );
            // if (privacyType.toLowerCase() !== "private") {
            //   // get user details
            //   const {
            //     rows: [user],
            //   } = await pgClient.query(
            //     `SELECT * FROM everything.user WHERE id = $1`,
            //     [ownerId]
            //   );
            //   // mint the nft
            //   const username = (
            //     user.wallet +
            //     "." +
            //     settings.master_account_id
            //   ).toLowerCase();
            //   const nft_id = await token.MintNFT(
            //     thing.id,
            //     {
            //       title: `Thing #${thing.id}`,
            //       issued_at: Date.now(),
            //       updated_at: Date.now(),
            //     },
            //     username
            //   );
            //   if (nft_id.error) {
            //     throw new NftMintException(
            //       `Error while minting Thing #${thing.id} to wallet ${user.wallet}, aborting.`
            //     );
            //   }
            //   // update thing with nft_id
            //   await pgClient.query(
            //     `UPDATE everything.thing SET nft_id = $1 WHERE id = $2 RETURNING *`,
            //     [nft_id, thing.id]
            //   );
            // }
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
      },
    },
  };
});

export default ThingMutationsPlugin;
