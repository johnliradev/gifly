import { listsTable } from "@/db/schema";
import { AppError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";
import { asc, eq } from "drizzle-orm";

export const getListsByUser = async (userId: number) => {
  const lists = await db
    .select({
      id: listsTable.id,
      name: listsTable.name,
      share_token: listsTable.share_token,
      is_public: listsTable.is_public,
      user_id: listsTable.user_id,
      is_default: listsTable.is_default,
      createdAt: listsTable.createdAt,
    })
    .from(listsTable)
    .where(eq(listsTable.user_id, userId))
    .orderBy(asc(listsTable.name))
    .limit(10);
  if (!lists.length) {
    throw new AppError("No lists found", 404, "NO_LISTS_FOUND");
  }
  return lists;
};
