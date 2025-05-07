import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export const db = drizzle(process.env.DATABASE_URL!);

export async function migrateDb() {
  console.log("Migrating database...");
  await migrate(db, { migrationsFolder: "./drizzle" }).catch((error) => {
    console.error("Failed to migrate database", error);
    process.exit(1);
  });
  console.log("Database migrated successfully\n");
}
