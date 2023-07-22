const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.route');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);

module.exports = app;
