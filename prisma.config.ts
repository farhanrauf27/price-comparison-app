import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma CLI uses this for 'prisma db push' and migrations
    url: env("POSTGRES_URL_NON_POOLING"), 
  },
});