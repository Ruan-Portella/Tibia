const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.route');
const adminRouter = require('./routes/admin.route');
const userRouter = require('./routes/user.route');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

module.exports = app;
