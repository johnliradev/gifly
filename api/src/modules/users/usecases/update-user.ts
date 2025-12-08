import { usersTable } from "@/db/schema";
import { AppError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";

export const updateUser = async (
  userId: number,
  name?: string,
  email?: string
) => {
  const [user] = await db
    .update(usersTable)
    .set({ name, email })
    .where(eq(usersTable.id, userId))
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    });
  if (!user) {
    throw new AppError("Failed to update user", 500, "USER_NOT_UPDATED");
  }
  return user;
};
