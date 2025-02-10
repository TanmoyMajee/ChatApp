const notFound = (req, res, next) => {
  const error = new Error(`Not Found YOO BRO GO BACK- ${req.originalUrl}`);
  res.status(404);
  next(error);
}
// dont know what is error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
}

module.exports = { notFound, errorHandler };