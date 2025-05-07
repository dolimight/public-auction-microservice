import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../db";
import { categoriesTable, categorySelectSchema } from "../db/schema";

const tags = ["Category"];

const categoryRoutes = new OpenAPIHono();

categoryRoutes.openapi(
  createRoute({
    path: "/",
    method: "get",
    summary: "Get all categories",
    description: "Returns a list of all categories",
    tags,
    responses: {
      200: {
        description: "List of categories",
        content: {
          "application/json": {
            schema: z.array(categorySelectSchema),
          },
        },
      },
    },
  }),
  async (c) => {
    return c.json(await db.select().from(categoriesTable));
  }
);

export { categoryRoutes };
