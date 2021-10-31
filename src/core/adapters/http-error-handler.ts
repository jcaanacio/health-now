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

export class ResourceNotFoundHttpError extends HealthNowHttpErrorHandler {
  readonly description: string;
  readonly scope: ErrorScope;
  readonly status: ErrorStatusCode;
  constructor() {
    super();
    this.description = ErrorDescription.ResourceNotFound;
    this.scope = ErrorScope.User;
    this.status = ErrorStatusCode.ResourceNotFound;
  }
}

export class ExpiredTokenHttpError extends HealthNowHttpErrorHandler {
  readonly description: string;
  readonly scope: ErrorScope;
  readonly status: ErrorStatusCode;
  constructor() {
    super();
    this.description = ErrorDescription.ExpiredToken;
    this.scope = ErrorScope.User;
    this.status = ErrorStatusCode.UnAuthorized;
  }
}

export class InvalidTokenHttpError extends HealthNowHttpErrorHandler {
  readonly description: string;
  readonly scope: ErrorScope;
  readonly status: ErrorStatusCode;
  constructor() {
    super();
    this.description = ErrorDescription.InvalidToken;
    this.scope = ErrorScope.User;
    this.status = ErrorStatusCode.UnAuthorized;
  }
}

export class UnAuthorizedHttpError extends HealthNowHttpErrorHandler {
  readonly description: string;
  readonly scope: ErrorScope;
  readonly status: ErrorStatusCode;
  constructor() {
    super();
    this.description = ErrorDescription.UnAuthorized;
    this.scope = ErrorScope.User;
    this.status = ErrorStatusCode.InSufficientRights;
  }
}

export class InsufficientRightsHttpError extends HealthNowHttpErrorHandler {
  readonly description: string;
  readonly scope: ErrorScope;
  readonly status: ErrorStatusCode;
  constructor() {
    super();
    this.description = ErrorDescription.InsufficientAccessRights;
    this.scope = ErrorScope.User;
    this.status = ErrorStatusCode.UnAuthorized;
  }
}

export class UnSupportedAuthStrategyHttpError extends HealthNowHttpErrorHandler {
  readonly description: string;
  readonly scope: ErrorScope;
  readonly status: ErrorStatusCode;
  constructor() {
    super();
    this.description = ErrorDescription.UnSupportedAuthStrategy;
    this.scope = ErrorScope.Client;
    this.status = ErrorStatusCode.UnAuthorized;
  }
}

export class MissingFieldHttpError extends HealthNowHttpErrorHandler {
  readonly description: string;
  readonly scope: ErrorScope;
  readonly status: ErrorStatusCode;
  readonly fields: string[];
  constructor(fields: string[]) {
    super();
    this.description = ErrorDescription.MissingFields;
    this.scope = ErrorScope.User;
    this.status = ErrorStatusCode.UnAuthorized;
    this.fields = fields;
  }
}

export class InvalidFieldFormatHttpError extends HealthNowHttpErrorHandler {
  readonly description: string;
  readonly scope: ErrorScope;
  readonly status: ErrorStatusCode;
  readonly fields: string[];
  constructor(fields: string[]) {
    super();
    this.description = ErrorDescription.InvalidFieldFormat;
    this.scope = ErrorScope.User;
    this.status = ErrorStatusCode.UnAuthorized;
    this.fields = fields;
  }
}

export class InvalidCredentialsHttpError extends HealthNowHttpErrorHandler {
  readonly description: string;
  readonly scope: ErrorScope;
  readonly status: ErrorStatusCode;
  constructor() {
    super();
    this.description = ErrorDescription.InvalidCredentials;
    this.scope = ErrorScope.User;
    this.status = ErrorStatusCode.UnAuthorized;
  }
}

enum ErrorStatusCode {
  UnAuthorized = 401,
  InSufficientRights = 403,
  ResourceNotFound = 404,
  EmailIsAlreadyInUse = 409,
  MissingRequiredFields = 412,
  InternalServerError = 500,
}

export enum ErrorDescription {
  InsufficientAccessRights = 'Invalid access rights.',
  InvalidToken = 'Token is Invalid.',
  ExpiredToken = 'Token is already expired.',
  EmailIsAlreadyInUse = 'Email is already in use.',
  InternalServerError = 'Internal server error.',
  MissingRequiredFields = 'Missing required fields.',
  ResourceNotFound = 'Resource not found.',
  UnAuthorized = 'Unauthorized to access this route.',
  UnSupportedAuthStrategy = 'Unsupported authentication strategy.',
  MissingFields = 'Missing Required Fields.',
  InvalidFieldFormat = 'Invalid Field Format.',
  InvalidCredentials = 'InvalidCredentials',
}

export enum ErrorScope {
  Client = 'Client',
  Server = 'Server',
  User = 'User',
}
