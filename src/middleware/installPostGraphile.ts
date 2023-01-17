import PgSimplifyInflectorPlugin from "@graphile-contrib/pg-simplify-inflector";
import { Express, Request, Response } from "express";
import { NodePlugin } from "graphile-build";
import { Pool, PoolClient } from "pg";
import {
  Middleware,
  postgraphile,
  PostGraphileOptions
} from "postgraphile";
const postgis = require("@graphile/postgis");

import PrimaryKeyMutationsOnlyPlugin from "../plugins/PrimaryKeyMutationsOnlyPlugin";
import RemoveQueryQueryPlugin from "../plugins/RemoveQueryQueryPlugin";
import ThingMutationsPlugin from "../plugins/ThingMutationsPlugin";
import AttributeMutationsPlugin from "../plugins/AttributeMutationsPlugin";
import OptionMutationsPlugin from "../plugins/OptionMutationsPlugin";
import handleErrors from "../utils/handleErrors";
import { getAuthPgPool, getRootPgPool } from "./installDatabasePools";
import MediaMutationsPlugin from "../plugins/MediaMutationsPlugin";

export interface OurGraphQLContext {
  pgClient: PoolClient;
  sessionId: string | null;
  rootPgPool: Pool;
  login(user: any): Promise<void>;
  logout(): Promise<void>;
}

// const TagsFilePlugin = makePgSmartTagsFromFilePlugin(
//   // We're using JSONC for VSCode compatibility; also using an explicit file
//   // path keeps the tests happy.
//   resolve(__dirname, "../../postgraphile.tags.jsonc")
// );

type UUID = string;

const isTest = process.env.NODE_ENV === "test";
const isDev = process.env.NODE_ENV === "development";

function uuidOrNull(input: string | number | null | undefined): UUID | null {
  if (!input) return null;
  const str = String(input);
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      str
    )
  ) {
    return str;
  } else {
    return null;
  }
}

interface IPostGraphileOptionsOptions {
  websocketMiddlewares?: Middleware<Request, Response>[];
  rootPgPool: Pool;
}

export function getPostGraphileOptions({
  rootPgPool,
}: IPostGraphileOptionsOptions) {
  const options: PostGraphileOptions<Request, Response> = {
    // This is so that PostGraphile installs the watch fixtures, it's also needed to enable live queries
    ownerConnectionString: process.env.DATABASE_URL,

    // On production we still want to start even if the database isn't available.
    // On development, we want to deal nicely with issues in the database.
    // For these reasons, we're going to keep retryOnInitFail enabled for both environments.
    retryOnInitFail: !isTest,

    // enableQueryBatching: On the client side, use something like apollo-link-batch-http to make use of this
    enableQueryBatching: true,

    // dynamicJson: instead of inputting/outputting JSON as strings, input/output raw JSON objects
    dynamicJson: true,

    // ignoreRBAC=false: honour the permissions in your DB - don't expose what you don't GRANT
    ignoreRBAC: false,

    // ignoreIndexes=false: honour your DB indexes - only expose things that are fast
    ignoreIndexes: false,

    // setofFunctionsContainNulls=false: reduces the number of nulls in your schema
    setofFunctionsContainNulls: false,

    // Enable GraphiQL in development
    graphiql: isDev || !!process.env.ENABLE_GRAPHIQL,
    // Use a fancier GraphiQL with `prettier` for formatting, and header editing.
    enhanceGraphiql: true,
    // Allow EXPLAIN in development (you can replace this with a callback function if you want more control)
    allowExplain: isDev,

    // Disable query logging - we're using morgan
    disableQueryLog: true,

    // Custom error handling
    handleErrors,

    // Automatically update GraphQL schema when database changes
    watchPg: true,

    // Keep data/schema.graphql up to date
    sortExport: true,
    exportGqlSchemaPath: `${__dirname}/../data/schema.graphql`,

    /*
     * Plugins to enhance the GraphQL schema, see:
     *   https://www.graphile.org/postgraphile/extending/
     */
    appendPlugins: [
      // PostGraphile adds a `query: Query` field to `Query` for Relay 1
      // compatibility. We don't need that.
      RemoveQueryQueryPlugin,

      // Adds support for our `postgraphile.tags.json5` file
      // TagsFilePlugin,

      // Simplifies the field names generated by PostGraphile.
      PgSimplifyInflectorPlugin,

      // Adds support for postgis
      postgis.default || postgis,

      // Omits by default non-primary-key constraint mutations
      PrimaryKeyMutationsOnlyPlugin,

      // UserMutationsPlugin,
      ThingMutationsPlugin,
      MediaMutationsPlugin,
      AttributeMutationsPlugin,
      OptionMutationsPlugin
    ],

    /*
     * Plugins we don't want in our schema
     */
    skipPlugins: [
      // Disable the 'Node' interface
      NodePlugin,
    ],

    graphileBuildOptions: {
      /*
       * Any properties here are merged into the settings passed to each Graphile
       * Engine plugin - useful for configuring how the plugins operate.
       */

      // Makes all SQL function arguments except those with defaults non-nullable
      pgStrictFunctions: true,
    },

    /*
     * Postgres transaction settings for each GraphQL query/mutation to
     * indicate to Postgres who is attempting to access the resources. These
     * will be referenced by RLS policies/triggers/etc.
     *
     * Settings set here will be set using the equivalent of `SET LOCAL`, so
     * certain things are not allowed. You can override Postgres settings such
     * as 'role' and 'search_path' here; but for settings indicating the
     * current user, session id, or other privileges to be used by RLS policies
     * the setting names must contain at least one and at most two period
     * symbols (`.`), and the first segment must not clash with any Postgres or
     * extension settings. We find `jwt.claims.*` to be a safe namespace,
     * whether or not you're using JWTs.
     */
    async pgSettings(req: any) {
      const settings = {};
      if (req.user) {
        settings["user.permissions"] = req.user.scopes;
      }
      return settings;
    },

    /*
     * These properties are merged into context (the third argument to GraphQL
     * resolvers). This is useful if you write your own plugins that need
     * access to, e.g., the logged in user.
     */
    // async additionalGraphQLContextFromRequest(
    //   req
    // ): Promise<Partial<OurGraphQLContext>> {
    //   return {
    //     // The current session id
    //     sessionId: uuidOrNull(req.user?.session_id),

    //     // Needed so passport can write to the database
    //     rootPgPool,

    //     // Use this to tell Passport.js we're logged in
    //     login: (user: any) =>
    //       new Promise((resolve, reject) => {
    //         req.login(user, (err) => (err ? reject(err) : resolve()));
    //       }),

    //     logout: () => {
    //       req.logout();
    //       return Promise.resolve();
    //     },
    //   };
    // },
  };
  return options;
}

export default function installPostGraphile(app: Express) {
  const authPgPool = getAuthPgPool(app);
  const rootPgPool = getRootPgPool(app);
  const middleware = postgraphile<Request, Response>(
    authPgPool,
    "everything",
    getPostGraphileOptions({
      rootPgPool,
    })
  );

  app.set("postgraphileMiddleware", middleware);

  app.use(middleware);
}
