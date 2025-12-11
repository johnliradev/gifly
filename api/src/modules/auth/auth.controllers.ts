import { login } from "./usecases/login";
import { registerUser } from "./usecases/register-user";
import { FastifyRequest, FastifyReply } from "fastify";
import { env } from "@/config/env";

export const registerUserController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name, email, password } = request.body as {
    name: string;
    email: string;
    password: string;
  };
  const { user, list } = await registerUser(name, email, password);
  reply.status(201).send({
    message: "User registered successfully",
    user: user,
    list: list,
  });
};

export const loginController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };
  const response = await login(email, password);
  reply.setCookie("token", response.token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60,
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    secure: env.NODE_ENV === "production",
  });
  reply.status(200).send({ message: "Login successful", user: response.user });
};
