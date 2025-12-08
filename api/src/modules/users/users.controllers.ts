import { FastifyRequest, FastifyReply } from "fastify";
import { getAllUsers } from "./usecases/get-all-users";

export const getAllUsersController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const users = await getAllUsers();
  reply.status(200).send(users);
};
