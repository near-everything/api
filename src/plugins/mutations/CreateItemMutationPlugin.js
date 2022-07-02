// const { makeExtendSchemaPlugin, gql } = require("graphile-utils");

// const CreateItemMutationPlugin = makeExtendSchemaPlugin((build) => {
//   const { pgSql: sql } = build;
//   return {
//     typeDefs: gql`
//       input NewAttributeInput {
//         attribute_id: Int!
//         initial_value: String!
//       }

//       input CreateItemInput {
//         category_id: Int!
//         subcategory_id: Int!
//         attributes: [NewAttributeInput!]!
//         media: [String!]!
//       }

//       type CreateItemPayload {
//         item: Item @pgField
//         query: Query
//       }

//       extend type Mutation {
//         createItem(input: CreateItemInput!): CreateItemPayload
//       }
//     `,
//     resolvers: {
//       Mutation: {
//         createItem: async (_query, args, context, resolveInfo) => {
//           const { pgClient } = context;
//           // Start a sub-transaction
//           await pgClient.query("SAVEPOINT graphql_mutation");
//           try {
//             // create the item
//             const {
//               rows: [item],
//             } = await pgClient.query(
//               `INSERT INTO everything.item(                category_id, subcategory_id, media              ) VALUES ($1, $2, $3)              RETURNING *`,
//               [
//                 args.input.category_id,
//                 args.input.subcategory_id,
//                 args.input.media,
//               ]
//             );
//             // create all the characteristics using the item id
//             await Promise.all(
//               args.input.attributes.map(async (attribute) => {
//                 await pgClient.query(
//                   `INSERT INTO everything.item_characteristic(                item_id, attribute_id, option_id, initial_value              ) VALUES ($1, $2, $3, $4)              RETURNING *`,
//                   [item.id, attribute.attribute_id, 2, attribute.initial_value]
//                 );
//               })
//             );
//             // get the item
//             const [row] =
//               await resolveInfo.graphile.selectGraphQLResultFromTable(
//                 sql.fragment`everything.item`,
//                 (tableAlias, queryBuilder) => {
//                   queryBuilder.where(
//                     sql.fragment`${tableAlias}.id = ${sql.value(item.id)}`
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

// module.exports = CreateItemMutationPlugin;
