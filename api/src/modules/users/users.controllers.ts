import { FastifyRequest, FastifyReply } from "fastify";
import { getUser } from "./usecases/get-user";

export const getAllUsersController = async (
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
