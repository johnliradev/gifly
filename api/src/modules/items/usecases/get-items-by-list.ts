import { db } from "@/lib/drizzle";
import { itemsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
export const getItemsByList = async (list_id: number) => {
  const items = await db
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
    .where(eq(itemsTable.list_id, list_id));
  return items;
};
