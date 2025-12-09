import { listsTable } from "@/db/schema";
import { AppError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";

export const deleteList = async (id: number) => {
  // First, fetch the list to check if it is default
  const [list] = await db
    .select({ id: listsTable.id, is_default: listsTable.is_default })
    .from(listsTable)
    .where(eq(listsTable.id, id));
  if (list.is_default) {
    throw new AppError(
      "Cannot delete the default list",
      400,
      "DEFAULT_LIST_CANNOT_BE_DELETED"
    );
  }
  const [deletedList] = await db
    .delete(listsTable)
    .where(eq(listsTable.id, id))
    .returning({ id: listsTable.id });

  if (!deletedList) {
    throw new AppError("Failed to delete list", 500, "INTERNAL_SERVER_ERROR");
  }
  return deletedList;
};
