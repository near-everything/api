const { makeExtendSchemaPlugin, gql } = require("graphile-utils");
const u = require("../../../utils/near/user");
const api = require("../../../utils/near/api");
const fs = require("fs");
const { generateUsername } = require("unique-username-generator");

const settings = JSON.parse(fs.readFileSync(api.CONFIG_PATH, "utf8"));

const CreateUserMutationPlugin = makeExtendSchemaPlugin((build) => {
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
            // check if invited
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
              // create the wallet
              const walletName = generateUsername();
              const name = (walletName + "." + settings.master_account_id).toLowerCase();
              let account = await u.CreateKeyPair(name);

              let status = await u.CreateAccount(account);

              if (!status) return { text: "Error" }; // throw exception
              // create user
              const {
                rows: [user],
              } = await pgClient.query(
                `INSERT INTO everything.user(                id,wallet              ) VALUES ($1, $2)              RETURNING *`,
                [uid, walletName]
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

module.exports = CreateUserMutationPlugin;
