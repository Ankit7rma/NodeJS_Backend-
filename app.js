const express = require('express');

const app = express();
const morgan = require('morgan');
const tourRoute = require('./routes/tourRoute');
const userRoute = require('./routes/userRoute');
// MiddleWare
app.use(express.json());
if (process.env.NODE_ENV === 'developement') {
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log('Hello from Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes

app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

// Handling Unhandled Routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'Fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

//   Start Server
module.exports = app;
