import { login } from "./usecases/login";
import { registerUser } from "./usecases/register-user";
import { FastifyRequest, FastifyReply } from "fastify";

export const registerUserController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { name, email, password } = request.body as {
    name: string;
    email: string;
    password: string;
  };
  const user = await registerUser(name, email, password);
  reply.status(201).send({
    message: "User registered successfully",
    userId: user,
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
  const user = await login(email, password);
  reply.status(200).send({
    message: "Login successful",
    token: user.token,
    user: user.user,
  });
};
