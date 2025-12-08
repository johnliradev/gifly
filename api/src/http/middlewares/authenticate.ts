import { FastifyRequest } from "fastify";
import { FastifyReply } from "fastify";
import { UnauthorizedError } from "@/http/errors/AppError";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw new UnauthorizedError("Invalid or expired token");
  }
}
