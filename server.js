const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors');
const AppError = require('./utils/AppError');
const errorHandler = require('./controllers/error/errorhandler');
const userRoute = require('./constants/index').ROUTES.USER;
const userRouter = require('./routes/userRoutes');
const cardRoute = require('./constants/index').ROUTES.CARD;
const cardRouter = require('./routes/cardRoutes');
const PORT = process.env.PORT || 5000;
dotenv.config({ path: './config/config.env' }); 
require('./config/dbConnection')();
const app = express();
// CORS
const corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200, 
  };
  app.get('/health-check',(req,res)=>{
	res.status('200').send("server is up and running");
  })

app.use(express.json());
app.use(cors(corsOptions));
 app.use(userRoute, userRouter);
app.use('/cards', cardRouter);
app.use(morgan('dev'));
app.all('*', (req, res, next) =>
next(new AppError(`can't find ${req.originalUrl} on this server`, 404))
);

app.use(errorHandler);

const server = app.listen(PORT, () => {
console.log(`listening on ${PORT}`);
});