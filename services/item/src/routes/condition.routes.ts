import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../db";
import { conditionSelectSchema, conditionsTable } from "../db/schema";

const tags = ["Condition"];

const conditionRoutes = new OpenAPIHono();

conditionRoutes.openapi(
  createRoute({
    path: "/",
    method: "get",
    summary: "Get all conditions",
    description: "Returns a list of all conditions",
    tags,
    responses: {
      200: {
        description: "List of conditions",
        content: {
          "application/json": {
            schema: z.array(conditionSelectSchema),
          },
        },
      },
    },
  }),
  async (c) => {
    return c.json(await db.select().from(conditionsTable));
  }
);

export { conditionRoutes };
