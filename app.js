const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestedTime = new Date().toLocaleString();
  next();
});
{
  // app.get('/', (req, res) => {
  //   res.status(200).json({ message: 'Hello from server 3000', app: 'Natours' });
  // });
  // app.post('/', (req, res) => {
  //   res.status(200).send('You can post to this endpoint..');
  // });
}
{
  //Routes
  // app.get('/api/v1/tours', getAllTours);
  // app.post('/api/v1/tours', createTour);
  // app.get('/api/v1/tours/:id', getTour);
  // app.patch('/api/v1/tours/:id', patchTour);
  // app.delete('/api/v1/tours/:id', deleteTour);
}
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
