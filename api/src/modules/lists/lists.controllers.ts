import { FastifyReply, FastifyRequest } from "fastify";
import { createList } from "./usecases/create-list";
import { getListsByUser } from "./usecases/get-lists-by-user";

export const createListController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { userId } = request.user as { userId: number };
  const { name, is_public } = request.body as {
    name: string;
    is_public: boolean;
  };
  const list = await createList(name, is_public, userId);
  reply.status(201).send({
    message: "List created successfully",
    list: {
      id: list.id,
      name: list.name,
      is_public: list.is_public,
      user_id: list.user_id,
      is_default: list.is_default,
      createdAt: list.createdAt,
    },
  });
};

export const getListsByUserController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { userId } = request.user as { userId: number };
  const lists = await getListsByUser(userId);
  reply.status(200).send({
    lists: lists,
  });
};
