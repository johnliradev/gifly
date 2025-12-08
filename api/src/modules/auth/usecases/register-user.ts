import { usersTable } from "@/db/schema";
import { AppError, ConflictError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<number> => {
  const [userExists] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  if (userExists) {
    throw new ConflictError("Email");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(usersTable)
    .values({ name, email, password_hash: passwordHash })
    .returning({
      id: usersTable.id,
    });
  if (!user) {
    throw new AppError("Failed to register user", 500, "USER_NOT_CREATED");
  }
  return user.id;
};
