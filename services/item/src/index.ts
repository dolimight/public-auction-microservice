import packageJSON from "../package.json";

import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { categoryRoutes } from "./routes/category.routes";
import { migrateDb, seedDb } from "./db";
import { conditionRoutes } from "./routes/condition.routes";
import { itemRoutes } from "./routes/item.routes";
import { logger } from "hono/logger";
import { betterStackLogger } from "./middleware/better-stack-logger.middleware";

await migrateDb();
await seedDb();

const app = new OpenAPIHono();

app.use("*", cors(), logger(betterStackLogger));

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: packageJSON.version,
    title: "Item Service",
  },
});

app.get("/", Scalar({ url: "/doc" }));
app.route("/category", categoryRoutes);
app.route("/condition", conditionRoutes);
app.route("/item", itemRoutes);

export default {
  port: 4200,
  fetch: app.fetch,
};
