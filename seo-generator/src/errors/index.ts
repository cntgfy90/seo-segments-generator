import { HttpStatus } from '@nestjs/common';

class BaseError extends Error {
  public status: HttpStatus;

  constructor(message: string, status: HttpStatus) {
    super(message);
    this.status = status;
  }
}

export class InternalServerError extends BaseError {
  constructor() {
    super(
      'Something went wrong during the request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.name = 'InternalServerError';
  }
}

export class ConfigurationError extends BaseError {
  constructor(name: string) {
    super(
      `Missing configuration for flowise. Provide ${name}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    this.name = 'ConfigurationError';
  }
}
