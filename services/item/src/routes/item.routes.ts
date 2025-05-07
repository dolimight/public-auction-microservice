import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../db";
import {
  categoriesTable,
  categorySelectSchema,
  conditionSelectSchema,
  conditionsTable,
  itemInsertSchema,
  itemSelectSchema,
  itemsTable,
  subCategoriesTable,
  subCategorySelectSchema,
} from "../db/schema";
import { eq, gt } from "drizzle-orm";
import { first } from "../utils/db";
import { getItemById, getItems } from "../db/functions/item.functions";

const tags = ["Item"];

const itemRoutes = new OpenAPIHono();

itemRoutes.openapi(
  createRoute({
    path: "/",
    method: "get",
    summary: "Get infinite items",
    description: "Returns a list of items",
    tags,
    request: {
      query: z.object({
        cursor: z.string().uuid().optional(),
        limit: z.coerce.number().positive().default(10),
      }),
    },
    responses: {
      200: {
        description: "List of items",
        content: {
          "application/json": {
            schema: z.object({
              items: z.array(
                itemSelectSchema
                  .omit({
                    categoryId: true,
                    subCategoryId: true,
                    conditionId: true,
                  })
                  .merge(
                    z.object({
                      category: categorySelectSchema,
                      subCategory: subCategorySelectSchema,
                      condition: conditionSelectSchema,
                    })
                  )
              ),
              nextCursor: z.string().uuid().optional(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const { cursor, limit } = c.req.valid("query");

    const items = await getItems({
      cursor: cursor,
      limit: limit + 1,
    });

    if (items.length <= limit) {
      return c.json({ items });
    }

    return c.json({
      items: items.slice(0, limit),
      nextCursor: items.at(-1)?.id,
    });
  }
);

itemRoutes.openapi(
  createRoute({
    path: "/",
    method: "put",
    summary: "Create or update items",
    description: "Creates or updates items",
    tags,
    request: {
      body: {
        content: {
          "application/json": {
            schema: itemInsertSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Item created or updated successfully",
        content: {
          "application/json": {
            schema: itemSelectSchema,
          },
        },
      },
      404: {
        description: "Item not found",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const body = c.req.valid("json");

    if (body.id) {
      const existingItem = await db
        .select()
        .from(itemsTable)
        .where(eq(itemsTable.id, body.id))
        .then(first);

      if (!existingItem) {
        return c.json({ error: "Item not found" }, 404);
      }

      const updatedItem = await db
        .update(itemsTable)
        .set(body)
        .where(eq(itemsTable.id, body.id))
        .returning()
        .then(first);

      return c.json(updatedItem);
    }

    const newItem = await db
      .insert(itemsTable)
      .values(body)
      .returning()
      .then(first);

    return c.json(newItem);
  }
);

itemRoutes.openapi(
  createRoute({
    path: ":id",
    method: "get",
    summary: "Gets an item",
    description: "Returns an item",
    tags,
    request: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
    responses: {
      200: {
        description: "Item found",
        content: {
          "application/json": {
            schema: itemSelectSchema
              .omit({
                categoryId: true,
                subCategoryId: true,
                conditionId: true,
              })
              .merge(
                z.object({
                  category: categorySelectSchema,
                  subCategory: subCategorySelectSchema,
                  condition: conditionSelectSchema,
                })
              ),
          },
        },
      },
      404: {
        description: "Item not found",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");

    const existingItem = await getItemById(id);

    if (!existingItem) {
      return c.json({ error: "Item not found" }, 404);
    }

    return c.json(existingItem, 200);
  }
);

export { itemRoutes };
