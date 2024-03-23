const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRoute = require('./routes/tourRoute');
const userRoute = require('./routes/userRoute');
// MiddleWare
app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log('Hello from Middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route handlers

// Routes

app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
//   Start Server
const port = 3000;
app.listen(3000, () => console.log(`Hello from server ${port}`));
