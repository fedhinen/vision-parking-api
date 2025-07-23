import { ZodError } from "zod";
import { FIELD_NAMES } from "../../utils/error-catalog";

export class HttpError extends Error {
  status: number;

  constructor(objError: { message: string, status: number }) {
    super(objError.message);
    this.message = objError.message;
    this.status = objError.status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError {
  status: number;
  errors: ZodError['issues'];

  constructor(zodError: ZodError) {
    this.status = 400;

    const errors = zodError.issues.map(error => {
      const field = error.path.join(', ');

      const fieldName = FIELD_NAMES[field]
      const message = error.message.replace('{field}', fieldName);

      return {
        ...error,
        message
      }
    })
    this.errors = errors;
  }
}

export class AuthError extends HttpError {
  constructor(objError: { message: string, status: number }) {
    super(objError);
  }
}

export class InternalServerError extends HttpError {
  constructor(objError: { message: string, status: number }) {
    super(objError)
  }
}

export class BadRequestError extends HttpError {
  constructor(objError: { message: string, status: number }) {
    super(objError)
  }
}

export class NotFoundError extends HttpError {
  constructor(objError: { message: string, status: number }) {
    super(objError)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(objError: { message: string, status: number }) {
    super(objError)
  }
}