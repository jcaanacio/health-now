"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsHttpError = exports.InvalidFieldFormatHttpError = exports.MissingFieldHttpError = exports.UnSupportedAuthStrategyHttpError = exports.InsufficientRightsHttpError = exports.UnAuthorizedHttpError = exports.InvalidTokenHttpError = exports.ExpiredTokenHttpError = exports.ResourceNotFoundHttpError = exports.HealthNowHttpErrorHandler = void 0;
class HealthNowHttpErrorHandler extends Error {
    constructor() {
        super(ErrorDescription.InternalServerError);
        this.description = ErrorDescription.InternalServerError;
        this.scope = ErrorScope.Server;
        this.status = ErrorStatusCode.InternalServerError;
    }
}
exports.HealthNowHttpErrorHandler = HealthNowHttpErrorHandler;
class ResourceNotFoundHttpError extends HealthNowHttpErrorHandler {
    constructor() {
        super();
        this.description = ErrorDescription.ResourceNotFound;
        this.scope = ErrorScope.User;
        this.status = ErrorStatusCode.ResourceNotFound;
    }
}
exports.ResourceNotFoundHttpError = ResourceNotFoundHttpError;
class ExpiredTokenHttpError extends HealthNowHttpErrorHandler {
    constructor() {
        super();
        this.description = ErrorDescription.ExpiredToken;
        this.scope = ErrorScope.User;
        this.status = ErrorStatusCode.UnAuthorized;
    }
}
exports.ExpiredTokenHttpError = ExpiredTokenHttpError;
class InvalidTokenHttpError extends HealthNowHttpErrorHandler {
    constructor() {
        super();
        this.description = ErrorDescription.InvalidToken;
        this.scope = ErrorScope.User;
        this.status = ErrorStatusCode.UnAuthorized;
    }
}
exports.InvalidTokenHttpError = InvalidTokenHttpError;
class UnAuthorizedHttpError extends HealthNowHttpErrorHandler {
    constructor() {
        super();
        this.description = ErrorDescription.UnAuthorized;
        this.scope = ErrorScope.User;
        this.status = ErrorStatusCode.InSufficientRights;
    }
}
exports.UnAuthorizedHttpError = UnAuthorizedHttpError;
class InsufficientRightsHttpError extends HealthNowHttpErrorHandler {
    constructor() {
        super();
        this.description = ErrorDescription.InsufficientAccessRights;
        this.scope = ErrorScope.User;
        this.status = ErrorStatusCode.UnAuthorized;
    }
}
exports.InsufficientRightsHttpError = InsufficientRightsHttpError;
class UnSupportedAuthStrategyHttpError extends HealthNowHttpErrorHandler {
    constructor() {
        super();
        this.description = ErrorDescription.UnSupportedAuthStrategy;
        this.scope = ErrorScope.User;
        this.status = ErrorStatusCode.UnAuthorized;
    }
}
exports.UnSupportedAuthStrategyHttpError = UnSupportedAuthStrategyHttpError;
class MissingFieldHttpError extends HealthNowHttpErrorHandler {
    constructor(fields) {
        super();
        this.description = ErrorDescription.MissingFields;
        this.scope = ErrorScope.User;
        this.status = ErrorStatusCode.UnAuthorized;
        this.fields = fields;
    }
}
exports.MissingFieldHttpError = MissingFieldHttpError;
class InvalidFieldFormatHttpError extends HealthNowHttpErrorHandler {
    constructor(fields) {
        super();
        this.description = ErrorDescription.InvalidFieldFormat;
        this.scope = ErrorScope.User;
        this.status = ErrorStatusCode.UnAuthorized;
        this.fields = fields;
    }
}
exports.InvalidFieldFormatHttpError = InvalidFieldFormatHttpError;
class InvalidCredentialsHttpError extends HealthNowHttpErrorHandler {
    constructor() {
        super();
        this.description = ErrorDescription.InvalidCredentials;
        this.scope = ErrorScope.User;
        this.status = ErrorStatusCode.UnAuthorized;
    }
}
exports.InvalidCredentialsHttpError = InvalidCredentialsHttpError;
var ErrorStatusCode;
(function (ErrorStatusCode) {
    ErrorStatusCode[ErrorStatusCode["UnAuthorized"] = 401] = "UnAuthorized";
    ErrorStatusCode[ErrorStatusCode["InSufficientRights"] = 403] = "InSufficientRights";
    ErrorStatusCode[ErrorStatusCode["ResourceNotFound"] = 404] = "ResourceNotFound";
    ErrorStatusCode[ErrorStatusCode["EmailIsAlreadyInUse"] = 409] = "EmailIsAlreadyInUse";
    ErrorStatusCode[ErrorStatusCode["MissingRequiredFields"] = 412] = "MissingRequiredFields";
    ErrorStatusCode[ErrorStatusCode["InternalServerError"] = 500] = "InternalServerError";
})(ErrorStatusCode || (ErrorStatusCode = {}));
var ErrorDescription;
(function (ErrorDescription) {
    ErrorDescription["InsufficientAccessRights"] = "Invalid access rights.";
    ErrorDescription["InvalidToken"] = "Token is Invalid.";
    ErrorDescription["ExpiredToken"] = "Token is already expired.";
    ErrorDescription["EmailIsAlreadyInUse"] = "Email is already in use.";
    ErrorDescription["InternalServerError"] = "Internal server error.";
    ErrorDescription["MissingRequiredFields"] = "Missing required fields.";
    ErrorDescription["ResourceNotFound"] = "Resource not found.";
    ErrorDescription["UnAuthorized"] = "Unauthorized to access this route.";
    ErrorDescription["UnSupportedAuthStrategy"] = "Unsupported authentication strategy.";
    ErrorDescription["MissingFields"] = "Missing Required Fields.";
    ErrorDescription["InvalidFieldFormat"] = "Invalid Field Format.";
    ErrorDescription["InvalidCredentials"] = "InvalidCredentials";
})(ErrorDescription || (ErrorDescription = {}));
var ErrorScope;
(function (ErrorScope) {
    ErrorScope["Client"] = "Client";
    ErrorScope["Server"] = "Server";
    ErrorScope["User"] = "User";
})(ErrorScope || (ErrorScope = {}));
//# sourceMappingURL=http-error-handler.js.map