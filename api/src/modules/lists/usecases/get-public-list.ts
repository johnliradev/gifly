import { listsTable } from "@/db/schema";
import { AppError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";
import { and, asc, eq } from "drizzle-orm";

export const getPublicList = async (id: number) => {
  const [list] = await db
    .select({
      id: listsTable.id,
      name: listsTable.name,
      is_public: listsTable.is_public,
      user_id: listsTable.user_id,
      is_default: listsTable.is_default,
      createdAt: listsTable.createdAt,
      updatedAt: listsTable.updatedAt,
    })
    .from(listsTable)
    .where(and(eq(listsTable.is_public, true), eq(listsTable.id, id)));

  if (!list) {
    throw new AppError(
      "No public list found with the specified ID",
      404,
      "NO_PUBLIC_LIST_FOUND"
    );
  }

  return list;
};
