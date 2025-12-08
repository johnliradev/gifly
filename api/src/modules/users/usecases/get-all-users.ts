import { usersTable } from "@/db/schema";
import { AppError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";
import { desc } from "drizzle-orm";

export const getAllUsers = async () => {
  const users = await db
    .select()
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt));
  if (!users) {
    throw new AppError("Failed to get users", 500, "INTERNAL_SERVER_ERROR");
  }
  return users;
};
