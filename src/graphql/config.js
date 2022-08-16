module.exports = {
  postgraphileOptionsDev: {
    watchPg: true,
    // subscriptions: true, : recommended, needs subscriptions plugin
    dynamicJson: true,
    setofFunctionsContainNulls: false,
    ignoreRBAC: false,
    showErrorStack: "json",
    extendedErrors: ["hint", "detail", "errcode"],
    exportGqlSchemaPath: "schema.graphql",
    graphiql: true,
    enhanceGraphiql: true,
    enableQueryBatching: true,
    legacyRelations: "omit",
  },
  postgraphileOptionsProd: {
    watchPg: false,
    // subscriptions: true, : recommended, needs subscriptions plugin
    retryOnInitFail: true,
    dynamicJson: true,
    setofFunctionsContainNulls: false,
    ignoreRBAC: false,
    extendedErrors: ["errcode"],
    graphiql: false,
    enableQueryBatching: true,
    disableQueryLog: true, // our default logging has performance issues, but do make sure you have a logging system in place!
    legacyRelations: "omit",
  }
}