// owner-of-item.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "@/lib/drizzle";
import { itemsTable, listsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NotFoundError, ForbiddenError } from "../errors/AppError";

export const ownerOfItem = async (request: FastifyRequest) => {
  const { userId } = request.user as { userId: number };
  const params = request.params as { id?: string; itemId?: string };
  const itemId = params.itemId || params.id;

  if (!itemId) {
    throw new NotFoundError("Item");
  }

  const [result] = await db
    .select({ user_id: listsTable.user_id })
    .from(itemsTable)
    .innerJoin(listsTable, eq(itemsTable.list_id, listsTable.id))
    .where(eq(itemsTable.id, Number(itemId)));

  if (!result) {
    throw new NotFoundError("Item");
  }
  if (result.user_id !== userId) {
    throw new ForbiddenError("You are not the owner of this item");
  }
};
