const { postgraphile } = require("postgraphile");
const postgis = require("@graphile/postgis");
const admin = require("firebase-admin");
const config = require("./config");
require("dotenv").config();

module.exports = {
  middleware: postgraphile(
    {
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOSTNAME,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT,
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              rejectUnauthorized: false,
              ca: process.env.CA_CERT,
            }
          : null,
    },
    process.env.POSTGRES_DATABASE,
    {
      ...(process.env.NODE_ENV === "production"
        ? config.postgraphileOptionsProd
        : config.postgraphileOptionsDev),
      appendPlugins: [
        require("@graphile-contrib/pg-simplify-inflector"),
        postgis.default || postgis,
        require("./plugins/mutations/CreateThingMutationPlugin"),
        require("./plugins/mutations/ApproveInviteMutationPlugin"),
        // require('./plugins/mutations/CreateCategoryMutationPlugin'),
        require("./plugins/mutations/CreateAttributeMutationPlugin"),
        require("./plugins/mutations/ProposeAttributeMutationPlugin"),
        require("./plugins/mutations/ProposeOptionMutationPlugin"),
        require("./plugins/mutations/CreateUserMutationPlugin"),
      ],
      pgSettings: async (req) => {
        if (req.headers.authorization === undefined) {
          return {
            role: "everything_anon",
          };
        } else {
          const token = req.headers.authorization.split("Bearer ")[1];
          const decodedToken = await admin.auth().verifyIdToken(token);
          // can check role, configure this role with database
          return {
            role: "everything_user",
            "jwt.claims.firebase": decodedToken.uid,
          };
        }
      },
    }
  ),
};
