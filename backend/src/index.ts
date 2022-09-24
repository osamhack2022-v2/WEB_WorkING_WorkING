import fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();

const app = fastify();

if (!process.env.FASTIFY_LISTEN) {
  process.exit(1);
}

app.listen({
  port: parseInt(process.env.FASTIFY_LISTEN),
});
