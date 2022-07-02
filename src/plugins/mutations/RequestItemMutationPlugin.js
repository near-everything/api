// const { makeExtendSchemaPlugin, gql } = require("graphile-utils");

// const RequestItemMutationPlugin = makeExtendSchemaPlugin((build) => {
//   const { pgSql: sql } = build;
//   return {
//     typeDefs: gql`
//       input RequestItemInput {
//         category_id: Int!
//         subcategory_id: Int!
//         attributes: [NewAttributeInput!]!
//         media: [String!]!
//       }

//       type RequestItemPayload {
//         request: Request @pgField
//         query: Query
//       }

//       extend type Mutation {
//         requestItem(input: RequestItemInput!): RequestItemPayload
//       }
//     `,
//     resolvers: {
//       Mutation: {
//         requestItem: async (_query, args, context, resolveInfo) => {
//           const { pgClient } = context;
//           // Start a sub-transaction
//           await pgClient.query("SAVEPOINT graphql_mutation");
//           try {
//             // Create the request
//             const {
//               rows: [request],
//             } = await pgClient.query(
//               `INSERT INTO everything.request(                category_id, subcategory_id, media              ) VALUES ($1, $2, $3)              RETURNING *`,
//               [
//                 args.input.category_id,
//                 args.input.subcategory_id,
//                 args.input.media,
//               ]
//             );
//             // Create all the characteristics using the request id
//             await Promise.all(
//               args.input.attributes.map(async (attribute) => {
//                 await pgClient.query(
//                   `INSERT INTO everything.request_characteristic(                request_id, attribute_id, option_id, initial_value              ) VALUES ($1, $2, $3, $4)              RETURNING *`,
//                   [request.id, attribute.attribute_id, 2, attribute.initial_value]
//                 );
//               })
//             );
//             // get the request
//             const [row] =
//               await resolveInfo.graphile.selectGraphQLResultFromTable(
//                 sql.fragment`everything.request`,
//                 (tableAlias, queryBuilder) => {
//                   queryBuilder.where(
//                     sql.fragment`${tableAlias}.id = ${sql.value(request.id)}`
//                   );
//                 }
//               );
//             return {
//               data: row,
//               query: build.$$isQuery,
//             };
//           } catch (e) {
//             // mutation failed, abort
//             await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
//             throw e;
//           } finally {
//             // Release our savepoint so it doesn't conflict with other mutations
//             await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
//           }
//         },
//       },
//     },
//   };
// });

// module.exports = RequestItemMutationPlugin;
