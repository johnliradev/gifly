import { FastifyReply, FastifyRequest } from "fastify";
import { createItem } from "./usecases/create-item";
import { getItemsByList } from "./usecases/get-items-by-list";

export const createItemController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const {
    name,
    url = null,
    description = "",
    estimated_price = "0.00",
    image_url = null,
    priority = "MEDIUM",
  } = request.body as {
    name: string;
    url?: string | null;
    description?: string;
    estimated_price?: string;
    image_url?: string | null;
    priority?: "LOW" | "MEDIUM" | "HIGH";
  };
  const { id } = request.params as { id: number };
  const item = await createItem(
    name,
    id,
    url,
    description,
    estimated_price,
    image_url,
    priority
  );
  reply.status(201).send({
    message: "Item created successfully",
    item: item,
  });
};
export const getItemsByListController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: number };
  const items = await getItemsByList(id);
  reply.status(200).send({
    message: "Items retrieved successfully",
    items: items,
  });
};
