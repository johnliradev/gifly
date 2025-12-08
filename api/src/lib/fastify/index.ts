import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "../../config/env";
import { registerPlugins } from "./plugins";
import { errorHandler } from "../../http/errors/error-handler";

export const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);
server.setErrorHandler(errorHandler);

export const buildServer = async () => {
  try {
    server.log.info(`Server is starting on port ${env.PORT}`);
    await registerPlugins(server);
    await server.ready();
    return server;
  } catch (error) {
    server.log.error(error, "Error building Fastify app");
    throw error;
  }
};
