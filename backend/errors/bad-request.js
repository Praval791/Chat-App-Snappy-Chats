import CustomAPIError from "./custom-api.js";

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(JSON.stringify(message));
    this.statusCode = 400;
    this.convertedInString = true;
  }
}

export default BadRequestError;
