const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const AppError = require('./utils/AppError');
const errorHandler = require('./controllers/error/errorhandler');

const PORT = process.env.PORT || 5000;
const app = express();
// CORS
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200, 
  };
  app.get('/health-check',(req,res)=>{
	res.status('200').send("server is up and running");
  })
app.use(cors(corsOptions));
app.all('*', (req, res, next) =>
next(new AppError(`can't find ${req.originalUrl} on this server`, 404))
);

app.use(errorHandler);

const server = app.listen(PORT, () => {
console.log(`listening on ${PORT}`);
});