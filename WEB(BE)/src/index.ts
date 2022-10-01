import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import * as Banner from "./common/banner";
import { registerRootEndpoints } from "./routes";
import fastifyCors from "@fastify/cors";
import dotenv from "dotenv";
import fs from "fs";
import { Config } from "./common/config";

dotenv.config();

const env = process.env.NODE_ENV || "development";
export const packageJson = JSON.parse(
  fs.readFileSync("package.json", { encoding: "utf-8" })
);
export const config = JSON.parse(
  fs.readFileSync("config.json", { encoding: "utf-8" })
) as Config;

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
