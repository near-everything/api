// @ts-nocheck
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const fs = require("fs");

const MediaMutationsPlugin = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`

      input CreateMediaInput {
        url: String!,
        thingId: String
      }

      type CreateMediaPayload {
        media: Media @pgField
        query: Query
      }

      extend type Mutation {
        createMedia(input: CreateMediaInput!): CreateMediaPayload
      }
    `,
    resolvers: {
      Mutation: {
        createMedia: async (_query, args, context, resolveInfo) => {
          const { pgClient } = context;
          const {
            url,
            thingId
          } = args.input;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");
          try {
            // create the media
            const {
              rows: [media],
            } = await pgClient.query(
              `INSERT INTO everything.media(media_url) VALUES ($1)              RETURNING *`,
              [
                url,
              ]
            ); 
            // if thingId provided, create tag
            if (thingId) {
              const {
                rows: [tag]
              } = await pgClient.query(
                `INSERT INTO everything.tag(thing_id, media_id) VALUES ($1, $2) RETURNING *`,
                [
                  thingId,
                  media.id
                ] 
              )
            }  
            // get and return the created media
            const [row] =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`everything.media`,
                (tableAlias, queryBuilder) => {
                  queryBuilder.where(
                    sql.fragment`${tableAlias}.id = ${sql.value(media.id)}`
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

export default MediaMutationsPlugin;
