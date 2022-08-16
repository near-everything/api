const { makeExtendSchemaPlugin, gql } = require("graphile-utils");

const ApproveInviteMutationPlugin = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      input ApproveInviteInput {
        phoneNumber: String!
      }

      type ApproveInvitePayload {
        invite: Invite @pgField
        query: Query
      }

      extend type Mutation {
        approveInvite(input: ApproveInviteInput!): ApproveInvitePayload
      }
    `,
    resolvers: {
      Mutation: {
        approveInvite: async (_query, args, context) => {
          const { pgClient } = context;
          // Start a sub-transaction
          await pgClient.query("SAVEPOINT graphql_mutation");
          try {
            // approve the invite
            const { rowCount } = await pgClient.query(
              `UPDATE everything.invite SET is_approved = true WHERE phone_number = $1;`,
              [args.input.phoneNumber]
            );
            return { success: rowCount === 1 };
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

module.exports = ApproveInviteMutationPlugin;
