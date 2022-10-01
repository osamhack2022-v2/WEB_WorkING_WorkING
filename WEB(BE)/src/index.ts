import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import * as Banner from "./common/banner";
import { registerRootEndpoints } from "./routes";
import fastifyCors from "@fastify/cors";
import dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV || "development";

export const isDevelopment = env === "development";
export const prisma = new PrismaClient();

Banner.showBanner();
Banner.devModeCheck();

const app = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

app.register(fastifyCors, {
  origin: true,
});

console.log("[Startup] Add Authentication Hook for Fastify...");

console.log("[Startup] Starting up fastify...");
registerRootEndpoints(app);

app.listen({ port: parseInt(process.env.FASTIFY_LISTEN as string) });
