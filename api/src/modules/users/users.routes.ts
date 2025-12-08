import { FastifyInstance } from "fastify";
import {
  getAllUsersController,
  updateUserController,
  deleteUserController,
} from "./users.controllers";
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
        response: {
          200: z.object({
            message: z.string(),
            user: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
              createdAt: z.coerce.string(),
              updatedAt: z.coerce.string(),
            }),
          }),
        },
      },
      preHandler: [authenticate],
    },
    getAllUsersController
  );
  // Update user (AUTHENTICATED)
  app.put(
    "/users/me",
    {
      schema: {
        description: "Update user info",
        tags: ["Users"],
        headers: z.object({
          authorization: z
            .string()
            .min(1, "Token is required")
            .startsWith("Bearer "),
        }),
        body: z.object({
          name: z
            .string()
            .min(3, { message: "Name must be at least 3 characters long" })
            .max(255, {
              message: "Name must be less than 255 characters long",
            })
            .optional(),
          email: z.email({ message: "Invalid email address" }).optional(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            user: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
              createdAt: z.coerce.string(),
              updatedAt: z.coerce.string(),
            }),
          }),
        },
      },
      preHandler: [authenticate],
    },
    updateUserController
  );
  // Delete user (AUTHENTICATED)
  app.delete(
    "/users/me",
    {
      schema: {
        description: "Delete user",
        tags: ["Users"],
        headers: z.object({
          authorization: z
            .string()
            .min(1, "Token is required")
            .startsWith("Bearer "),
        }),
        response: {
          204: z.object({}),
        },
      },
      preHandler: [authenticate],
    },
    deleteUserController
  );
};
