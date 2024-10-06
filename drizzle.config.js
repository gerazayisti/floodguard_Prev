export default {
    dialect: "postgresql",
    schema: "./src/utils/db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
      url: "postgresql://floodguardDb_owner:BlJ07zUdPSIQ@ep-plain-thunder-a2orzlio.eu-central-1.aws.neon.tech/floodguardDb?sslmode=require",
      connectionString:
        "postgresql://floodguardDb_owner:BlJ07zUdPSIQ@ep-plain-thunder-a2orzlio.eu-central-1.aws.neon.tech/floodguardDb?sslmode=require",
    },
  };
  