const errorHandlerMiddleware = (err, req, res, next) => {
  // console.log(err);

  // return res.status(500).json({ err });
  let customError = {
    statusCode: err.statusCode || 500,
    msg: err.message || `Something went wrong try again later`,
  };

  if (err.name === "CastError") {
    customError.msg = `No item found with Id : ${err.value}`;
    customError.statusCode = 404;
  }

  // mongoose validation errors
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `We already have a account for this ${Object.keys(
      err.keyValue
    )} ,Please try to register with another email or you can login with that (${
      err.keyValue[Object.keys(err.keyValue)]
    }) email. `;
    customError.statusCode = 400;
  }
  if (err.convertedInString === true) {
    customError.msg = JSON.parse(customError.msg);
  }
  if (!customError.msg.text) {
    customError.msg = { text: customError.msg };
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
