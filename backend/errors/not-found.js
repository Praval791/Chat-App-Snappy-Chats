import CustomAPIError from "./custom-api.js";

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(JSON.stringify(message));
    this.statusCode = 404;
    this.convertedInString = true;
  }
}

export default NotFoundError;
