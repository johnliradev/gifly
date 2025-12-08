import { usersTable } from "@/db/schema";
import { AppError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";

export const getUser = async (userId: number) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (!user) {
    throw new AppError("Failed to get user", 500, "INTERNAL_SERVER_ERROR");
  }
  return user;
};
