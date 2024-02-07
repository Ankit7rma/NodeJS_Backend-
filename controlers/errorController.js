module.exports = (err, req, res, next) => {
  // Shows where error happened
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
