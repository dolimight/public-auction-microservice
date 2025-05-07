import { aliasedTable, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgSchema,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

const { createInsertSchema, createSelectSchema } = createSchemaFactory({
  coerce: {
    date: true,
    number: true,
  },
});

export const itemSchema = pgSchema("item");

export const categoriesTable = itemSchema.table("category", {
  id: integer().primaryKey(),
  name: text().notNull(),
});

export const categorySelectSchema = createSelectSchema(categoriesTable);
export const categoryInsertSchema = createInsertSchema(categoriesTable);
export type CategorySelectSchema = z.infer<typeof categorySelectSchema>;
export type CategoryInsertSchema = z.infer<typeof categoryInsertSchema>;

export const subCategoriesTable = aliasedTable(categoriesTable, "subCategory");

export const subCategorySelectSchema = createSelectSchema(subCategoriesTable);
export const subCategoryInsertSchema = createInsertSchema(subCategoriesTable);
export type SubCategorySelectSchema = z.infer<typeof subCategorySelectSchema>;
export type SubCategoryInsertSchema = z.infer<typeof subCategoryInsertSchema>;

export const conditionsTable = itemSchema.table("condition", {
  id: integer().primaryKey(),
  name: text().notNull(),
});

export const conditionSelectSchema = createSelectSchema(conditionsTable);
export const conditionInsertSchema = createInsertSchema(conditionsTable);
export type ConditionSelectSchema = z.infer<typeof conditionSelectSchema>;
export type ConditionInsertSchema = z.infer<typeof conditionInsertSchema>;

export const itemsTable = itemSchema.table(
  "item",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    image: text().notNull(),
    shortDescription: text().notNull(),
    longDescription: text().notNull(),
    categoryId: integer()
      .notNull()
      .references(() => categoriesTable.id),
    subCategoryId: integer()
      .notNull()
      .references(() => categoriesTable.id),
    startingBid: real().notNull(),
    buyNowPrice: real(),
    bidIncrement: real().notNull(),
    startDate: timestamp({ withTimezone: true }).notNull(),
    endDate: timestamp({ withTimezone: true }).notNull(),
    sellerId: uuid().notNull(),
    conditionId: integer()
      .notNull()
      .references(() => conditionsTable.id),
  },
  (table) => [
    index("search_index").using(
      "gin",
      sql`(
        setweight(to_tsvector('english', ${table.title}), 'A') ||
        setweight(to_tsvector('english', ${table.shortDescription}), 'B') ||
        setweight(to_tsvector('english', ${table.longDescription}), 'C')
      )`
    ),
  ]
);

export const itemSelectSchema = createSelectSchema(itemsTable);
export const itemInsertSchema = createInsertSchema(itemsTable, {
  startingBid: (schema) => schema.positive(),
  buyNowPrice: (schema) => schema.positive(),
  bidIncrement: (schema) => schema.positive(),
});
export type ItemSelectSchema = z.infer<typeof itemSelectSchema>;
export type ItemInsertSchema = z.infer<typeof itemInsertSchema>;
