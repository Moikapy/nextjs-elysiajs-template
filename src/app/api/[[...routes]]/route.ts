import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors, HTTPMethod } from "@elysiajs/cors";

const corsConfig = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"] as HTTPMethod[],
  allowedHeaders: "*",
  exposedHeaders: "*",
  maxAge: 5,
};

const swaggerConfig = {
  documenation: {
    info: {
      title: "API Documentation",
      version: "0.0.0",
    },
  },
  path: "/documentation",
};

const app = new Elysia({ prefix: "/api" })
  .use(cors(corsConfig))
  .use(swagger(swaggerConfig))
  .get('/hello', () => 'Hello from Elysia!');

// Expose methods
export const GET = app.handle;
export const POST = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
export const PUT = app.handle;

export type API = typeof app;
