import { listsTable, usersTable } from "@/db/schema";
import { AppError, ConflictError } from "@/http/errors/AppError";
import { db } from "@/lib/drizzle";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ user: { id: number }; list: { id: number } }> => {
  const [userExists] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  if (userExists) {
    throw new ConflictError("Email");
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const { user, list } = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(usersTable)
      .values({ name, email, password_hash: passwordHash })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        createdAt: usersTable.createdAt,
      });
    if (!user) {
      throw new AppError("Failed to register user", 500, "USER_NOT_CREATED");
    }
    const [list] = await tx
      .insert(listsTable)
      .values({
        name: "My wishlist",
        visibility: "public",
        user_id: user.id,
        is_default: true,
      })
      .returning({
        id: listsTable.id,
        name: listsTable.name,
        visibility: listsTable.visibility,
        user_id: listsTable.user_id,
        is_default: listsTable.is_default,
        createdAt: listsTable.createdAt,
      });
    if (!list) {
      throw new AppError(
        "Failed to create default list",
        500,
        "LIST_NOT_CREATED"
      );
    }
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      list: {
        id: list.id,
        name: list.name,
        visibility: list.visibility,
        user_id: list.user_id,
        is_default: list.is_default,
        createdAt: list.createdAt,
      },
    };
  });
  return { user, list };
};
