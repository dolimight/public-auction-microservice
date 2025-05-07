import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { userRoutes } from "./routes/user.routes";
import { migrateDb } from "./db";
import { logger } from "hono/logger";
import { betterStackLogger } from "./middleware/better-stack-logger.middleware";

import packageJSON from "../package.json";

await migrateDb();

const app = new OpenAPIHono();

app.use("*", cors(), logger(betterStackLogger));

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: packageJSON.version,
    title: "User Profile Service",
  },
});

app.get("/", Scalar({ url: "/doc" }));
app.route("/", userRoutes);

export default {
  port: 4000,
  fetch: app.fetch,
};
