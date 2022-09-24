import fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();

const app = fastify();

app.listen({
  port: parseInt(process.env.FASTIFY_LISTEN),
});
