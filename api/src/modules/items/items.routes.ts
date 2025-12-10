import { FastifyInstance } from "fastify";
import {
  createItemController,
  getItemsByListController,
  getItemController,
  updateItemController,
  deleteItemController,
} from "./items.controllers";
import { z } from "zod";
import { authenticate } from "@/http/middlewares/authenticate";
import { ownerOfList } from "@/http/middlewares/owner-of-list";
import { ownerOfItem } from "@/http/middlewares/owner-of-item";

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

  // Get item by id (AUTHENTICATED AND OWNER OF ITEM)
  app.get(
    "/items/:itemId",
    {
      schema: {
        description: "Get item by id",
        tags: ["Items"],
        params: z.object({
          itemId: z.coerce.number(),
        }),
        headers: z.object({
          authorization: z
            .string()
            .min(1, "Token is required")
            .startsWith("Bearer "),
        }),
      },
      preHandler: [authenticate, ownerOfItem],
    },
    getItemController
  );

  // Update item (AUTHENTICATED AND OWNER OF ITEM)
  app.patch(
    "/items/:itemId",
    {
      schema: {
        description: "Update item",
        tags: ["Items"],
        params: z.object({
          itemId: z.coerce.number(),
        }),
        body: z
          .object({
            name: z.string().min(1).optional(),
            url: z.string().nullable().optional(),
            description: z.string().optional(),
            estimated_price: z.string().optional(),
            image_url: z.string().nullable().optional(),
            priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
            status: z
              .enum(["PURCHASED", "DESIRED", "GIFTED", "RESERVED", "ARCHIVED"])
              .optional(),
          })
          .refine(
            (data) =>
              data.name !== undefined ||
              data.url !== undefined ||
              data.description !== undefined ||
              data.estimated_price !== undefined ||
              data.image_url !== undefined ||
              data.priority !== undefined ||
              data.status !== undefined,
            { message: "At least one field must be provided" }
          ),
        headers: z.object({
          authorization: z
            .string()
            .min(1, "Token is required")
            .startsWith("Bearer "),
        }),
        response: {
          200: z.object({
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
              status: z.enum([
                "PURCHASED",
                "DESIRED",
                "GIFTED",
                "RESERVED",
                "ARCHIVED",
              ]),
              createdAt: z.coerce.string(),
              updatedAt: z.coerce.string(),
            }),
          }),
        },
      },
      preHandler: [authenticate, ownerOfItem],
    },
    updateItemController
  );

  // Delete item (AUTHENTICATED AND OWNER OF ITEM)
  app.delete(
    "/items/:itemId",
    {
      schema: {
        description: "Delete item",
        tags: ["Items"],
        params: z.object({
          itemId: z.coerce.number(),
        }),
        headers: z.object({
          authorization: z
            .string()
            .min(1, "Token is required")
            .startsWith("Bearer "),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
      preHandler: [authenticate, ownerOfItem],
    },
    deleteItemController
  );
};
