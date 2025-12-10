import { db } from "@/lib/drizzle";
import { itemsTable } from "@/db/schema";
import { NotFoundError } from "@/http/errors/AppError";
import { eq } from "drizzle-orm";

export const deleteItem = async (itemId: number) => {
  const [deletedItem] = await db
    .delete(itemsTable)
    .where(eq(itemsTable.id, itemId))
    .returning({ id: itemsTable.id });

  if (!deletedItem) {
    throw new NotFoundError("Item");
  }

  return deletedItem;
};

