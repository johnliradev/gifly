import { buildServer } from "../lib/fastify";
import { env } from "../config/env";

const main = async () => {
  const server = await buildServer();
  try {
    await server.listen({ port: env.PORT, host: env.HOST });
  } catch (error) {
    server.log.error(error, "Error starting server");
    process.exit(1);
  }
};

main();
