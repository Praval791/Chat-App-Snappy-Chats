import CustomAPIError from "./custom-api.js";

class AlreadyExistsError extends CustomAPIError {
  constructor(message) {
    super(JSON.stringify(message));
    this.statusCode = 409;
    this.convertedInString = true;
  }
}

export default AlreadyExistsError;
