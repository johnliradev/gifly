import { listsTable } from "@/db/schema";
import { AppError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";
import { eq, sql } from "drizzle-orm";

export const updateList = async (
  id: number,
  name?: string,
  is_public?: boolean
) => {
  const fieldsToUpdate: { name?: string; is_public?: boolean } = {};
  if (name !== undefined) {
    fieldsToUpdate.name = name;
  }
  if (is_public !== undefined) {
    fieldsToUpdate.is_public = is_public;
  }
  const [list] = await db
    .update(listsTable)
    .set({ ...fieldsToUpdate, updatedAt: sql`now()` as any })
    .where(eq(listsTable.id, id))
    .returning({
      id: listsTable.id,
      name: listsTable.name,
      is_public: listsTable.is_public,
      user_id: listsTable.user_id,
      is_default: listsTable.is_default,
      createdAt: listsTable.createdAt,
      updatedAt: listsTable.updatedAt,
    });
  if (!list) {
    throw new AppError("Failed to update list", 500, "INTERNAL_SERVER_ERROR");
  }
  return {
    id: list.id,
    name: list.name,
    is_public: list.is_public,
    user_id: list.user_id,
    is_default: list.is_default,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
  };
};
