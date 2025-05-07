import { pgSchema, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const userSchema = pgSchema("user");

export const usersTable = userSchema.table("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
});

export const userSelectSchema = createSelectSchema(usersTable);
export const userInsertSchema = createInsertSchema(usersTable);
export type UserSelectSchema = z.infer<typeof userSelectSchema>;
export type UserInsertSchema = z.infer<typeof userInsertSchema>;
