import { itemsTable } from "@/db/schema";
import { AppError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";

export const createItem = async (
  name: string,
  list_id: number,
  url: string | null | undefined,
  description: string,
  estimated_price: string,
  image_url: string | null | undefined,
  priority: "LOW" | "MEDIUM" | "HIGH"
) => {
  const [newItem] = await db
    .insert(itemsTable)
    .values({
      name,
      list_id,
      url: url || null,
      description: description || "",
      estimated_price: estimated_price || "0.00",
      image_url: image_url || null,
      priority,
    })
    .returning({
      id: itemsTable.id,
      name: itemsTable.name,
      list_id: itemsTable.list_id,
      url: itemsTable.url,
      description: itemsTable.description,
      estimated_price: itemsTable.estimated_price,
      image_url: itemsTable.image_url,
      priority: itemsTable.priority,
    });
  if (!newItem) {
    throw new AppError("Failed to create item", 500, "INTERNAL_SERVER_ERROR");
  }
  return newItem;
};
