import { ForbiddenError, NotFoundError } from "../errors/AppError";
import { FastifyRequest } from "fastify";
import { db } from "@/lib/drizzle";
import { listsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const ownerOfList = async (request: FastifyRequest) => {
  const { userId } = request.user as { userId: number };
  const { id } = request.params as { id: string };

  const [list] = await db
    .select({ user_id: listsTable.user_id })
    .from(listsTable)
    .where(eq(listsTable.id, Number(id)));

  if (!list) {
    throw new NotFoundError("List");
  }
  if (list.user_id !== userId) {
    throw new ForbiddenError("You are not the owner of this list");
  }
};
