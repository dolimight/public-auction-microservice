import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { publish } from "../services/pubsub.service";
import { db } from "../db";
import { desc, eq } from "drizzle-orm";
import { first } from "../utils/db";
import { bidInsertSchema, bidSelectSchema, bidsTable } from "../db/schema";
import { getUsers } from "../services/user-profile.service";

const tags = ["Bid"];

const bidRoutes = new OpenAPIHono();

bidRoutes.openapi(
  createRoute({
    path: ":itemId",
    method: "get",
    summary: "Gets all bids",
    description: "Returns a list of all bids",
    tags,
    request: {
      params: z.object({
        itemId: z.string().uuid(),
      }),
    },
    responses: {
      200: {
        description: "Bids found",
        content: {
          "application/json": {
            schema: z.array(
              bidSelectSchema.omit({ userId: true }).extend({
                user: z
                  .object({
                    id: z.string().uuid(),
                    email: z.string().email(),
                    name: z.string().optional(),
                  })
                  .optional(),
              })
            ),
          },
        },
      },
    },
  }),
  async (c) => {
    const { itemId } = c.req.valid("param");

    const bids = await db
      .select()
      .from(bidsTable)
      .where(eq(bidsTable.itemId, itemId))
      .orderBy(desc(bidsTable.createdAt));

    const users = await getUsers();

    const userMap = new Map(users.map((user) => [user.id, user]));

    const bidsWithUsers = bids.map((bid) => ({
      ...bid,
      user: userMap.get(bid.userId),
    }));

    return c.json(bidsWithUsers);
  }
);

bidRoutes.openapi(
  createRoute({
    path: ":itemId",
    method: "post",
    summary: "Creates a new bid",
    description: "Creates a new bid for an item",
    tags,
    request: {
      params: z.object({
        itemId: z.string().uuid(),
      }),
      body: {
        content: {
          "application/json": {
            schema: bidInsertSchema.omit({ itemId: true }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Bid created successfully",
        content: {
          "application/json": {
            schema: bidSelectSchema,
          },
        },
      },
      400: {
        description: "Bad request, cannot bid on your own bid",
      },
      500: {
        description: "Internal server error, failed to create bid",
      },
    },
  }),
  async (c) => {
    const { itemId } = c.req.valid("param");
    const body = c.req.valid("json");

    const bids = await db
      .select()
      .from(bidsTable)
      .where(eq(bidsTable.itemId, itemId))
      .orderBy(desc(bidsTable.createdAt));

    const lastBid = first(bids);

    if (lastBid?.userId === body.userId) {
      return c.body("You cannot bid on your own bid.", 400);
    }

    if (lastBid && lastBid.amount >= body.amount) {
      return c.body("Bid amount must be higher than the last bid.", 400);
    }

    const newBid = await db
      .insert(bidsTable)
      .values({
        ...body,
        itemId,
      })
      .returning()
      .then(first);

    if (!newBid) {
      return c.body("Failed to create bid.", 500);
    }

    await Promise.all([
      publish(`bid:item:${itemId}`, newBid),
      publish("bid", newBid),
    ]);

    return c.json(newBid, 200);
  }
);

export { bidRoutes };
