import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const routes = async (app: FastifyInstance) => {
  app.get(
    "/health",
    {
      schema: {
        description: "Health check endpoint",
        tags: ["Health"],
        response: {
          200: z.object({
            status: z.string(),
            timestamp: z.string(),
          }),
        },
      },
    },
    (request: FastifyRequest, reply: FastifyReply) =>
      reply.send({
        status: "ok",
        timestamp: new Date().toISOString(),
      })
  );
};
