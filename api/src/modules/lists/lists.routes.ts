import { FastifyInstance } from "fastify";
import {
  createListController,
  getListsByUserController,
  updateListController,
} from "./lists.controllers";
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
  app.patch(
    "/lists/:id",
    {
      schema: {
        description: "Update a list",
        tags: ["Lists"],
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
      preHandler: [authenticate],
    },
    updateListController
  );
};
