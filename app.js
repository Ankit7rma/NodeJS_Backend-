const express = require('express');

const app = express();

app.get('/', (req, res) =>
  res.status(200).json({
    message: 'Request Response from Server Side',
    App: 'Natours',
  })
);
const port = 3000;
app.listen(3000, () => console.log(`Hello from server ${port}`));
