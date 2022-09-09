const admin = require("firebase-admin");

module.exports = {
  init: async function () {
    if (process.env.NODE_ENV === "production") {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_ADMIN_SDK_CONFIG || ""
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099";
      admin.initializeApp({ projectId: "demo-everything" });
    }
  },
};
