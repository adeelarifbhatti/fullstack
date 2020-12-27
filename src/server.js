// Don't work for some reason
//const dotenv = require('dotenv');
//dotenv.config({ path: './config.env' });

const app = require('./app');
console.log(process.env);
// Doesn't work
//const port = process.env.PORT ; 
const port = 5000;
app.listen(port, () => {
console.log (`Server started on port " + ${port}`);
});