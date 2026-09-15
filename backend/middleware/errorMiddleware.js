// Central error handling so every failure returns JSON (not an HTML page).
// Without this, the frontend's `err.response.data.message` is always undefined.

export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server Error";

  // Mongoose: bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Mongoose: validation failure
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Mongo: duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate value for: ${Object.keys(err.keyValue || {}).join(", ")}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack }),
  });
};
