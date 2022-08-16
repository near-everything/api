// const { makeExtendSchemaPlugin, gql } = require("graphile-utils");

// const CreateCategoryMutationPlugin = makeExtendSchemaPlugin((build) => {
//   const { pgSql: sql } = build;
//   return {
//     typeDefs: gql`
//       input AddSubcategoryInput {
//         name: String!
//         description: String
//       }

//       input CreateCategoryInput  {
//         name: String!
//         description: String
//         subcategories: [AddSubcategoryInput!]!
//       }

//       type CreateCategoryPayload {
//         category: Category @pgField
//         query: Query
//       }

//       extend type Mutation {
//         createCategory(input: CreateCategoryInput!): CreateCategoryPayload
//       }
//     `,
//     resolvers: {
//       Mutation: {
//         createCategory: async (_query, args, context, resolveInfo) => {
//           const { pgClient } = context;
//           // Start a sub-transaction
//           await pgClient.query("SAVEPOINT graphql_mutation");
//           try {
//             // create the category
//             const {
//               rows: [category],
//             } = await pgClient.query(
//               `INSERT INTO everything.category(                name, description              ) VALUES ($1, $2)              RETURNING *`,
//               [
//                 args.input.name,
//                 args.input.description,
//               ]
//             );
//             // create all the subcategories using the category id
//             await Promise.all(
//               args.input.subcategories.map(async (subcategory) => {
//                 await pgClient.query(
//                   `INSERT INTO everything.subcategory(                category_id, name, description              ) VALUES ($1, $2, $3)              RETURNING *`,
//                   [category.id, subcategory.name, subcategory.description]
//                 );
//               })
//             );
//             // create a catch-all subcategory
//             await pgClient.query(
//               `INSERT INTO everything.subcategory(                category_id, name, description              ) VALUES ($1, $2, $3)              RETURNING *`,
//               [category.id, "other", "catch-all"]
//             );

//             // get the category
//             const [row] =
//               await resolveInfo.graphile.selectGraphQLResultFromTable(
//                 sql.fragment`everything.category`,
//                 (tableAlias, queryBuilder) => {
//                   queryBuilder.where(
//                     sql.fragment`${tableAlias}.id = ${sql.value(category.id)}`
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

// module.exports = CreateCategoryMutationPlugin;
