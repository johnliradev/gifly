import { listsTable } from "@/db/schema";
import { NotFoundError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";

export const getListById = async (id: number) => {
  const [list] = await db
    .select({
      id: listsTable.id,
      name: listsTable.name,
      share_token: listsTable.share_token,
      is_public: listsTable.is_public,
      user_id: listsTable.user_id,
      is_default: listsTable.is_default,
      createdAt: listsTable.createdAt,
      updatedAt: listsTable.updatedAt,
    })
    .from(listsTable)
    .where(eq(listsTable.id, id));
  if (!list) {
    throw new NotFoundError("List");
  }
  return {
    id: list.id,
    name: list.name,
    share_token: list.share_token,
    is_public: list.is_public,
    user_id: list.user_id,
    is_default: list.is_default,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
  };
};
