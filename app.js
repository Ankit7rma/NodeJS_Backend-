const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
// Simple GET POST Request
// app.get('/', (req, res) =>
//   res.status(200).json({
//     message: 'Request Response from Server Side',
//     App: 'Natours',
//   })
// );

// app.post('/', (req, res) => res.send('Post Request Response'));
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: { tours },
  });
});

app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);
  res.send('Post request finished');
});

const port = 3000;
app.listen(3000, () => console.log(`Hello from server ${port}`));
