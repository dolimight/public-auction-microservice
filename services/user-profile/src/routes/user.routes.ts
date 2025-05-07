import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { publish } from "../services/pubsub.service";
import { userInsertSchema, userSelectSchema, usersTable } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { first } from "../utils/db";

const tags = ["User"];

const userRoutes = new OpenAPIHono();

userRoutes.openapi(
  createRoute({
    path: "/users",
    method: "get",
    summary: "Get all users",
    description: "Returns a list of all users",
    tags,
    responses: {
      200: {
        description: "A list of users",
        content: {
          "application/json": {
            schema: z.array(userSelectSchema),
          },
        },
      },
    },
  }),
  async (c) => {
    return c.json(await db.select().from(usersTable));
  }
);

userRoutes.openapi(
  createRoute({
    path: "/user/{userId}",
    method: "get",
    summary: "Gets a users",
    description: "Returns a user",
    tags,
    responses: {
      200: {
        description: "User found",
        content: {
          "application/json": {
            schema: userSelectSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const userId = c.req.param("userId");

    return c.json(
      await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .then(first)
    );
  }
);

userRoutes.openapi(
  createRoute({
    path: "/user",
    method: "post",
    summary: "Create a new user",
    description: "Creates a new user with the provided details",
    tags,
    request: {
      body: {
        content: {
          "application/json": {
            schema: userInsertSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "User created successfully",
        content: {
          "application/json": {
            schema: userSelectSchema,
          },
        },
      },
      400: {
        description: "User already exists",
      },
    },
  }),
  async (c) => {
    const body = c.req.valid("json");

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, body.email))
      .then(first);

    if (user) {
      return c.body(null, 400);
    }

    const newUser = await db
      .insert(usersTable)
      .values(body)
      .returning()
      .then(first);

    if (!newUser) {
      return c.body(null, 404);
    }

    await publish("user", newUser);

    return c.json(newUser);
  }
);

export { userRoutes };
