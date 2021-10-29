export abstract class HealthNowHttpErrorHandler extends Error {
  readonly description: string;
  readonly scope: ErrorScope;
  readonly status: ErrorStatusCode;
  constructor() {
    super(ErrorDescription.InternalServerError);
    this.description = ErrorDescription.InternalServerError;
    this.scope = ErrorScope.Server;
    this.status = ErrorStatusCode.InternalServerError;
  }
}

enum ErrorStatusCode {
  ResourceNotFound = 404,
  EmailIsAlreadyInUse = 409,
  MissingRequiredFields = 412,
  InternalServerError = 500,
}

enum ErrorDescription {
  EmailIsAlreadyInUse = 'Email is already in use.',
  InternalServerError = 'Internal server error.',
  MissingRequiredFields = 'Missing required fields.',
  ResourceNotFound = 'Resource not found.',
}

enum ErrorScope {
  Client = 'Client',
  Server = 'Server',
  User = 'User',
}
