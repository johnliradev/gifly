import { db } from "@/lib/drizzle";
import { usersTable } from "@/db/schema";
import { AppError } from "@/http/errors/AppError";
import { eq } from "drizzle-orm";

export const deleteUser = async (userId: number) => {
  const user = await db.delete(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    throw new AppError("Failed to delete user", 500, "USER_NOT_DELETED");
  }
  return user;
};
