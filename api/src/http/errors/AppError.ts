export class AppError extends Error {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly code: string | undefined;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR"
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    this.code = code;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}
export class ConflictError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} already exists`, 409, "CONFLICT");
  }
}
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}
