import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "./AppError";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Se o erro for uma validação de schema do Zod
  // If the error is a Zod schema validation
  if (hasZodFastifySchemaValidationErrors(error)) {
    reply.status(400).send({
      statusCode: 400,
      error: "VALIDATION_ERROR",
      message: "Validation failed",
      issues: error.validation.map((issue) => issue.message),
    });
    return;
  }
  // Se o erro for uma instância de AppError (erro customizado)
  // if it is an instance of AppError (custom error)
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.code,
      message: error.message,
    });
    return;
  }
  // Erros genéricos ou erros desconhecidos
  // Generic errors or unknown errors
  console.error("Unhandled error:", error);
  reply.status(500).send({
    statusCode: 500,
    error: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
  });
}
