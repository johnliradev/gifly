import { ValidationError } from "@/http/errors/AppError";
import bcrypt from "bcryptjs";
import { server } from "@/lib/fastify";
import { db } from "@/lib/drizzle";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const login = async (email: string, password: string) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  if (!user) {
    throw new ValidationError("Invalid email or password");
  }
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    throw new ValidationError("Invalid email or password");
  }
  const token = await server.jwt.sign({
    userId: user.id,
  });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
