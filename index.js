require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { errorHandler, checkError } = require('./utils/errors/errorHandler');
const { verifyAccessToken } = require('./utils/helpers/jwtHelper');
require('./utils/helpers/db');

// Import the routes!
const authRoute = require('./routes/auth');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Add the middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', verifyAccessToken, async (req, res, next) => {
  res.send('Hello! this server is healthy');
});

// User Routes
app.use('/api/user', authRoute);

// Error Handling Middlewares
app.use(checkError);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Healthy server running on ${PORT}!`));
