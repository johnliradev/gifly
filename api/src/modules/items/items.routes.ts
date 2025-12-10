import { FastifyInstance } from "fastify";
import {
  createItemController,
  getItemsByListController,
} from "./items.controllers";
import { z } from "zod";
import { authenticate } from "@/http/middlewares/authenticate";
import { ownerOfList } from "@/http/middlewares/owner-of-list";

export const itemsRoutes = async (app: FastifyInstance) => {
  // Create a new item (AUTHENTICATED AND OWNER OF LIST)
  app.post(
    "/lists/:id/items",
    {
      schema: {
        description: "Create a new item",
        tags: ["Items"],
        params: z.object({
          id: z.coerce.number(),
        }),
        body: z.object({
          name: z.string().min(1, "Name is required"),
          url: z.string().nullable().optional(),
          description: z.string().optional(),
          estimated_price: z.string().optional(),
          image_url: z.string().nullable().optional(),
          priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        }),
        headers: z.object({
          authorization: z
            .string()
            .min(1, "Token is required")
            .startsWith("Bearer "),
        }),
        response: {
          201: z.object({
            message: z.string(),
            item: z.object({
              id: z.number(),
              name: z.string(),
              list_id: z.number(),
              url: z.string().nullable(),
              description: z.string().optional(),
              estimated_price: z.string().optional(),
              image_url: z.string().nullable(),
              priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
            }),
          }),
        },
      },
      preHandler: [authenticate, ownerOfList],
    },
    createItemController
  );
  // Get items by list (AUTHENTICATED AND OWNER OF LIST)
  app.get(
    "/lists/:id/items",
    {
      schema: {
        description: "Get items by list",
        tags: ["Items"],
        params: z.object({
          id: z.coerce.number(),
        }),
        headers: z.object({
          authorization: z
            .string()
            .min(1, "Token is required")
            .startsWith("Bearer "),
        }),
      },

      preHandler: [authenticate, ownerOfList],
    },
    getItemsByListController
  );
};
