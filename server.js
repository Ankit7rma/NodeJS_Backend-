const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const port = process.env.Node || 3000;
app.listen(3000, () => console.log(`Hello from server ${port}`));

console.log(app.get('env'));
// console.log(process.env);
