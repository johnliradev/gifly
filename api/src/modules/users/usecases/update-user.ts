import { usersTable } from "@/db/schema";
import { AppError, ConflictError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";
import { eq, sql } from "drizzle-orm";

export const updateUser = async (
  userId: number,
  name?: string,
  email?: string
) => {
  const fieldsToUpdate: { name?: string; email?: string } = {};
  if (name !== undefined) {
    fieldsToUpdate.name = name;
  }
  if (email !== undefined) {
    fieldsToUpdate.email = email;
    const [userExists] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    if (userExists) {
      throw new ConflictError("Email");
    }
  }
  const [user] = await db
    .update(usersTable)
    .set({ ...fieldsToUpdate, updatedAt: sql`now()` as any })
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
