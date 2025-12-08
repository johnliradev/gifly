import { FastifyInstance } from "fastify";
import { getAllUsersController } from "./users.controllers";

export const usersRoutes = async (app: FastifyInstance) => {
  // Get all users (ADMIN ONLY)
  app.get(
    "/users",
    {
      schema: {
        description: "Get all users",
        tags: ["Users"],
      },
    },
    getAllUsersController
  );
};
