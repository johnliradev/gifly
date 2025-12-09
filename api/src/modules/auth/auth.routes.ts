import { FastifyInstance } from "fastify";
import { loginController, registerUserController } from "./auth.controllers";
import { z } from "zod";
export const authRoutes = async (app: FastifyInstance) => {
  //  Register a new user (PUBLIC)
  app.post(
    "/auth/register",
    {
      schema: {
        description: "Register a new user",
        tags: ["Auth"],
        body: z.object({
          name: z
            .string()
            .min(3, { message: "Name must be at least 3 characters long" })
            .max(255, {
              message: "Name must be less than 255 characters long",
            }),
          email: z.email({ message: "Invalid email address" }),
          password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(32, {
              message: "Password must be less than 32 characters long",
            }),
        }),
        response: {
          201: z.object({
            message: z.string(),
            user: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
              createdAt: z.coerce.string(),
            }),
            list: z.object({
              id: z.number(),
              name: z.string(),
              visibility: z.string(),
              user_id: z.number(),
              is_default: z.boolean(),
              createdAt: z.coerce.string(),
            }),
          }),
        },
      },
    },
    registerUserController
  );
  //  Login a user (PUBLIC)
  app.post(
    "/auth/login",
    {
      schema: {
        description: "Login a user",
        tags: ["Auth"],
        body: z.object({
          email: z.email({ message: "Invalid email address" }),
          password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" }),
        }),
        response: {
          200: z.object({
            message: z.string(),
            token: z.string(),
            user: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
            }),
          }),
        },
      },
    },
    loginController
  );
};
