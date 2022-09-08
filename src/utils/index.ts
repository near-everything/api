export function sanitizeEnv() {
  const requiredEnvvars: string[] = [
    "AUTH_DATABASE_URL",
    "DATABASE_URL",
  ];
  requiredEnvvars.forEach((envvar) => {
    if (!process.env[envvar]) {
      throw new Error(
        `Could not find process.env.${envvar}.`
      );
    }
  });
}
