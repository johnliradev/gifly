import { itemsTable, listsTable, usersTable } from "@/db/schema";
import { AppError, NotFoundError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";
import { and, eq } from "drizzle-orm";

export const getSharedList = async (shareToken: string) => {
  const [result] = await db
    .select({
      id: listsTable.id,
      name: listsTable.name,
      share_token: listsTable.share_token,
      is_public: listsTable.is_public,
      createdAt: listsTable.createdAt,
      updatedAt: listsTable.updatedAt,
      owner_name: usersTable.name,
    })
    .from(listsTable)
    .innerJoin(usersTable, eq(listsTable.user_id, usersTable.id))
    .where(
      and(eq(listsTable.share_token, shareToken), eq(listsTable.is_public, true))
    );

  if (!result) {
    throw new NotFoundError("List");
  }

  const items = await db
    .select({
      id: itemsTable.id,
      name: itemsTable.name,
      url: itemsTable.url,
      description: itemsTable.description,
      estimated_price: itemsTable.estimated_price,
      image_url: itemsTable.image_url,
      priority: itemsTable.priority,
      status: itemsTable.status,
    })
    .from(itemsTable)
    .where(eq(itemsTable.list_id, result.id));

  return {
    id: result.id,
    name: result.name,
    share_token: result.share_token,
    is_public: result.is_public,
    owner_name: result.owner_name,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    items,
  };
};
