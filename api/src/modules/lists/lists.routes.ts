import { FastifyInstance } from "fastify";
import { createListController } from "./lists.controllers";
import { z } from "zod";
import { authenticate } from "@/http/middlewares/authenticate";

export const listsRoutes = async (app: FastifyInstance) => {
  app.post(
    "/lists",
    {
      schema: {
        description: "Create a new list",
        tags: ["Lists"],
        body: z.object({
          name: z.string(),
          is_public: z.boolean(),
        }),
      },
      preHandler: [authenticate],
    },
    createListController
  );
};
