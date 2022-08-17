import CustomAPIError from "./custom-api.js";

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(JSON.stringify(message));
    this.statusCode = 401;
    this.convertedInString = true;
  }
}

export default UnauthenticatedError;
