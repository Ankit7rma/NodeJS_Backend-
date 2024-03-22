const express = require('express');

const app = express();

app.get('/', (req, res) => res.status(200).send('Request Response'));
const port = 3000;
app.listen(3000, () => console.log(`Hello from server ${port}`));
