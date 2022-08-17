const notFound = (req, res) =>
  res
    .status(404)
    .send(
      `Route [${req.originalUrl}] does not exist for ${req.method} request method`
    );

export default notFound;
