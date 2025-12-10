import { db } from "@/lib/drizzle";
import { itemsTable } from "@/db/schema";
import { NotFoundError } from "@/http/errors/AppError";
import { eq } from "drizzle-orm";

export const getItem = async (itemId: number) => {
  const [item] = await db
    .select({
      id: itemsTable.id,
      name: itemsTable.name,
      list_id: itemsTable.list_id,
      url: itemsTable.url,
      description: itemsTable.description,
      estimated_price: itemsTable.estimated_price,
      image_url: itemsTable.image_url,
      priority: itemsTable.priority,
      status: itemsTable.status,
      createdAt: itemsTable.createdAt,
      updatedAt: itemsTable.updatedAt,
    })
    .from(itemsTable)
    .where(eq(itemsTable.id, itemId));

  if (!item) {
    throw new NotFoundError("Item");
  }

  return item;
};
