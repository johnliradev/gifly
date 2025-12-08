import { FastifyInstance } from "fastify";
import { getAllUsersController } from "./users.controllers";
import { authenticate } from "@/http/middlewares/authenticate";
import z from "zod";

export const usersRoutes = async (app: FastifyInstance) => {
  // Get all users (AUTHENTICATED)
  app.get(
    "/users/me",
    {
      schema: {
        description: "Get user info",
        tags: ["Users"],
        headers: z.object({
          authorization: z
            .string()
            .min(1, "Token is required")
            .startsWith("Bearer "),
        }),
      },
      preHandler: [authenticate],
    },
    getAllUsersController
  );
};
