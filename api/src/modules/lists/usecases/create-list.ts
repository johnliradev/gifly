import { listsTable } from "@/db/schema";
import { AppError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";

export const createList = async (
  name: string,
  is_public: boolean,
  userId: number,
  isDefault: boolean = false
) => {
  const [list] = await db
    .insert(listsTable)
    .values({
      name,
      is_public,
      user_id: userId,
      is_default: isDefault,
    })
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
    throw new AppError("Failed to create list", 500, "INTERNAL_SERVER_ERROR");
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
