import { db } from "@/lib/drizzle";
import { usersTable } from "@/db/schema";
import { AppError } from "@/http/errors/AppError";
import { eq } from "drizzle-orm";

export const deleteUser = async (userId: number) => {
  const [deletedUser] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, userId))
    .returning({
      id: usersTable.id,
    });
  if (!deletedUser) {
    throw new AppError("Failed to delete user", 500, "USER_NOT_DELETED");
  }
  return deletedUser;
};
