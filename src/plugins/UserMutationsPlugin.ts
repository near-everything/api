// @ts-nocheck
const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const fs = require("fs");

const UserMutationsPlugin = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  return {
    typeDefs: gql`
      input CreateUserInput {
        uid: String!
      }

      type CreateUserPayload {
        user: User @pgField
        query: Query
      }

      extend type Mutation {
        createUser(input: CreateUserInput!): CreateUserPayload
      }
    `,
    resolvers: {
      Mutation: {
        createUser: async (_query, args, context, resolveInfo) => {
          const { pgClient } = context;
          const { uid } = args.input;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");
          try {
            // check if User exsists
            const [row] =
              await resolveInfo.graphile.selectGraphQLResultFromTable(
                sql.fragment`everything.user`,
                (tableAlias, queryBuilder) => {
                  queryBuilder.where(
                    sql.fragment`${tableAlias}.id = ${sql.value(uid)}`
                  );
                }
              );
            // if exists
            if (row) {
              return {
                data: row,
                query: build.$$isQuery,
              };
            } else {
              // create user
              const {
                rows: [user],
              } = await pgClient.query(
                `INSERT INTO everything.user(                id              ) VALUES ($1)              RETURNING *`,
                [uid]
              );
              // get new user
              const [row] =
                await resolveInfo.graphile.selectGraphQLResultFromTable(
                  sql.fragment`everything.user`,
                  (tableAlias, queryBuilder) => {
                    queryBuilder.where(
                      sql.fragment`${tableAlias}.id = ${sql.value(user.id)}`
                    );
                  }
                );
              return {
                data: row,
                query: build.$$isQuery,
              };
            }
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

export default UserMutationsPlugin;
