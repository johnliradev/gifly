import { FastifyInstance } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";
import fastifyJwt from "@fastify/jwt";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { routes } from "../../http/routes";
import { env } from "@/config/env";
import fastifyCookie from "@fastify/cookie";

export const registerPlugins = async (server: FastifyInstance) => {
  await server.register(fastifyCors, {
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
  await server.register(fastifyCookie, {
    secret: env.JWT_SECRET,
  });
  await server.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });
  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Gifly API",
        description: "API for Gifly",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });
  await server.register(routes, { prefix: "/api" });
  await server.register(scalarApiReference, { routePrefix: "/api/docs" });
};
