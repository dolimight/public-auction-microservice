import { pgSchema, real, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const biddingSchema = pgSchema("bidding");

export const bidsTable = biddingSchema.table("bids", {
  id: uuid().primaryKey().defaultRandom(),
  itemId: uuid().notNull(),
  userId: uuid().notNull(),
  amount: real().notNull(),
  createdAt: timestamp().defaultNow(),
});

export const bidSelectSchema = createSelectSchema(bidsTable);
export const bidInsertSchema = createInsertSchema(bidsTable);
export type BidSelectSchema = z.infer<typeof bidSelectSchema>;
export type BidInsertSchema = z.infer<typeof bidInsertSchema>;
