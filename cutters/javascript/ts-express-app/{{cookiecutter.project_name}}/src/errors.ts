/* eslint-disable max-classes-per-file */

export class RequestError extends Error {
  title: string = 'Request Error';

  status: number = 500;

  constructor(
    message: string,
    title: string = 'Request Error',
    status: number = 500,
  ) {
    super(message);
    this.title = title;
    this.status = status;
  }
}

export class InvalidUsage extends RequestError {
  constructor(message: string) {
    super(message, 'Invalid Usage', 400);
  }
}

export class Unauthorized extends RequestError {
  constructor(message: string) {
    super(message, 'Unauthorized', 401);
  }
}

export class Forbidden extends RequestError {
  constructor(message: string) {
    super(message, 'Forbidden', 403);
  }
}

export class NotFound extends RequestError {
  constructor(message: string) {
    super(message, 'Not Found', 404);
  }
}

export class ServerError extends RequestError {
  constructor(message: string) {
    super(message, 'Server Error', 500);
  }
}

export default {
  RequestError,
  InvalidUsage,
  Unauthorized,
  Forbidden,
  NotFound,
  ServerError,
};
