import fp from "fastify-plugin";
import cors, { FastifyCorsOptions } from "@fastify/cors";

export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    origin: ["https://192.168.1.11", "https://localhost"],
  });
  console.log("registre cors");
});
