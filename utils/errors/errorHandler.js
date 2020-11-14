const createError = require('http-errors');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  res.status(err.status);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
};

const checkError = async (req, res, next) => {
  next(createError.NotFound("The route doesn't exists!"));
};
module.exports = { errorHandler, checkError };
