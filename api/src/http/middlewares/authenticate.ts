import { FastifyRequest } from "fastify";
import { FastifyReply } from "fastify";
import { UnauthorizedError } from "@/http/errors/AppError";
import { server } from "@/lib/fastify";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const token = request.cookies.token;
    if (!token) {
      throw new UnauthorizedError("Invalid or expired token");
    }
    const decoded = await server.jwt.verify(token);
    request.user = decoded;
  } catch (err) {
    throw new UnauthorizedError("Invalid or expired token");
  }
}
