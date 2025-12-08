import { FastifyRequest, FastifyReply } from "fastify";
import { getUser } from "./usecases/get-user";
import { updateUser } from "./usecases/update-user";
import { deleteUser } from "./usecases/delete-user";

export const getUserController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = request.user as { userId: number };
  const userInfo = await getUser(user.userId);
  reply.status(200).send({
    message: "User retrieved successfully",
    user: userInfo,
  });
};

export const updateUserController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = request.user as { userId: number };
  const { name, email } = request.body as {
    name?: string;
    email?: string;
  };
  const userInfo = await updateUser(user.userId, name, email);
  reply.status(200).send({
    message: "User updated successfully",
    user: userInfo,
  });
};

export const deleteUserController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = request.user as { userId: number };
  await deleteUser(user.userId);
  reply.status(204).send();
};
