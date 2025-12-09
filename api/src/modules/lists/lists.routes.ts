import { FastifyInstance } from "fastify";
import {
  createListController,
  deleteListController,
  getListByIdController,
  getListsByUserController,
  getPublicListController,
  updateListController,
} from "./lists.controllers";
import { z } from "zod";
import { authenticate } from "@/http/middlewares/authenticate";
import { ownerOfList } from "@/http/middlewares/owner-of-list";

export const listsRoutes = async (app: FastifyInstance) => {
  // Create a new list (AUTHENTICATED AND OWNER OF LIST)
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
        headers: z.object({
          authorization: z
            .string()
            .min(1, "Token is required")
            .startsWith("Bearer "),
        }),
        response: {
          201: z.object({
            message: z.string(),
            list: z.object({
              id: z.number(),
              name: z.string(),
              is_public: z.boolean(),
              user_id: z.number(),
              is_default: z.boolean(),
              createdAt: z.coerce.string(),
            }),
          }),
        },
      },
      preHandler: [authenticate],
    },
    createListController
  );
  // Get lists by user (AUTHENTICATED AND OWNER OF LIST)
  app.get(
    "/lists",
    {
      schema: {
        description: "Get lists by user",
        tags: ["Lists"],
        headers: z.object({
          authorization: z
            .string()
            .min(1, "Token is required")
            .startsWith("Bearer "),
        }),
        response: {
          200: z.object({
            lists: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                is_public: z.boolean(),
                user_id: z.number(),
                is_default: z.boolean(),
                createdAt: z.coerce.string(),
              })
            ),
          }),
        },
      },

      preHandler: [authenticate],
    },
    getListsByUserController
  );
  // Update a list (AUTHENTICATED AND OWNER OF LIST)
  app.patch(
    "/lists/:id",
    {
      schema: {
        description: "Update a list",
        tags: ["Lists"],
        params: z.object({
          id: z.string(),
        }),
        headers: z.object({
          authorization: z
            .string()
            .min(1, "Token is required")
            .startsWith("Bearer "),
        }),
        body: z
          .object({
            name: z.string().min(1, "Name is required").optional(),
            is_public: z.boolean().optional(),
          })
          .refine(
            (data) => data.name !== undefined || data.is_public !== undefined,
            {
              message: "At least one field must be provided",
            }
          ),
        response: {
          200: z.object({
            message: z.string(),
            list: z.object({
              id: z.number(),
              name: z.string(),
              is_public: z.boolean(),
              user_id: z.number(),
              is_default: z.boolean(),
              createdAt: z.coerce.string(),
              updatedAt: z.coerce.string(),
            }),
          }),
        },
      },
      preHandler: [authenticate, ownerOfList],
    },
    updateListController
  );
  // Delete a list (AUTHENTICATED AND OWNER OF LIST)
  app.delete(
    "/lists/:id",
    {
      schema: {
        description: "Delete a list",
        tags: ["Lists"],
        params: z.object({
          id: z.string(),
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
      preHandler: [authenticate, ownerOfList],
    },
    deleteListController
  );
  // Get a list by id (AUTHENTICATED AND OWNER OF LIST)
  app.get(
    "/lists/:id",
    {
      schema: {
        description: "Get a list by id",
        tags: ["Lists"],
        params: z.object({
          id: z.string(),
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
            list: z.object({
              id: z.number(),
              name: z.string(),
              is_public: z.boolean(),
              user_id: z.number(),
              is_default: z.boolean(),
              createdAt: z.coerce.string(),
              updatedAt: z.coerce.string(),
            }),
          }),
        },
      },
      preHandler: [authenticate, ownerOfList],
    },
    getListByIdController
  );
  // Get public lists (AUTHENTICATED)
  app.get(
    "/lists/public/:id",
    {
      schema: {
        description: "Get a public list by id",
        tags: ["Lists"],
        params: z.object({
          id: z.string(),
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
            list: z.object({
              id: z.number(),
              name: z.string(),
              is_public: z.boolean(),
              user_id: z.number(),
              is_default: z.boolean(),
              createdAt: z.coerce.string(),
              updatedAt: z.coerce.string(),
            }),
          }),
        },
      },
      preHandler: [authenticate],
    },
    getPublicListController
  );
};
