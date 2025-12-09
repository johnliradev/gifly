import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { usersRoutes } from "@/modules/users/users.routes";
import { authRoutes } from "@/modules/auth/auth.routes";
import { listsRoutes } from "@/modules/lists/lists.routes";

export const routes = async (app: FastifyInstance) => {
  await usersRoutes(app);
  await authRoutes(app);
  await listsRoutes(app);
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
