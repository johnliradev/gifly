import { FastifyReply, FastifyRequest } from "fastify";
import { createList } from "./usecases/create-list";
import { getListsByUser } from "./usecases/get-lists-by-user";
import { updateList } from "./usecases/update-list";
import { deleteList } from "./usecases/delete-list";
import { getListById } from "./usecases/get-list-by-id";
import { getPublicList } from "./usecases/get-public-list";
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

export const updateListController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: number };
  const { name, is_public } = request.body as {
    name?: string;
    is_public?: boolean;
  };
  const list = await updateList(id, name, is_public);
  reply.status(200).send({
    message: "List updated successfully",
    list: list,
  });
};

export const deleteListController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: number };
  const deletedList = await deleteList(id);
  reply.status(200).send({
    message: "List deleted successfully",
  });
};

export const getListByIdController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: number };
  const list = await getListById(id);
  reply.status(200).send({
    message: "List retrieved successfully",
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

export const getPublicListController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: number };
  const list = await getPublicList(id);
  reply.status(200).send({
    message: "Public list retrieved successfully",
    list: {
      id: list.id,
      name: list.name,
      is_public: list.is_public,
      user_id: list.user_id,
      is_default: list.is_default,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
    },
  });
};
