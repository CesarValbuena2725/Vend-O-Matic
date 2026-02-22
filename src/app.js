const express = require('express');
const sessionConfig = require('./config/session');
const vendingRoutes = require('./routes/vendingRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express();

app.use(express.json());
app.use(sessionConfig);
app.use(errorHandler)

app.use('/', vendingRoutes);

module.exports = app;