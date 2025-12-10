import { db } from "@/lib/drizzle";
import { itemsTable } from "@/db/schema";
import { AppError, NotFoundError } from "@/http/errors/AppError";
import { eq, sql } from "drizzle-orm";

export const updateItem = async (
  itemId: number,
  name?: string,
  url?: string | null,
  description?: string,
  estimated_price?: string,
  image_url?: string | null,
  priority?: "LOW" | "MEDIUM" | "HIGH",
  status?: "PURCHASED" | "DESIRED" | "GIFTED" | "RESERVED" | "ARCHIVED"
) => {
  const fieldsToUpdate: Record<string, any> = {};

  // Só adiciona campos que foram realmente passados com valores válidos
  if (name !== undefined && name !== "") fieldsToUpdate.name = name;
  if (url !== undefined) fieldsToUpdate.url = url || null;
  if (description !== undefined && description !== "") fieldsToUpdate.description = description;
  if (estimated_price !== undefined && estimated_price !== "") fieldsToUpdate.estimated_price = estimated_price;
  if (image_url !== undefined) fieldsToUpdate.image_url = image_url || null;
  if (priority !== undefined) fieldsToUpdate.priority = priority;
  if (status !== undefined) fieldsToUpdate.status = status;

  const [item] = await db
    .update(itemsTable)
    .set({ ...fieldsToUpdate, updatedAt: sql`now()` as any })
    .where(eq(itemsTable.id, itemId))
    .returning({
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
    });

  if (!item) {
    throw new NotFoundError("Item");
  }

  return item;
};

