class CustomError extends Error {
  constructor(type, message, status) {
    super();

    this.name = 'CustomError';
    this.type = type;
    this.message = message;
    this.status = status || 500;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { CustomError };
