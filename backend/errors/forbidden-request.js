import CustomAPIError from "./custom-api.js";

class ForbiddenRequestError extends CustomAPIError {
  constructor(message) {
    super(JSON.stringify(message));
    this.statusCode = 403;
    this.convertedInString = true;
  }
}

export default ForbiddenRequestError;
