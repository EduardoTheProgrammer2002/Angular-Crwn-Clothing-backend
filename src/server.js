const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const app = express();

const corOptions = {credential: true, origin: process.env.url || "*"};

app.use(cors(corOptions));
app.use(cookieParser());
app.use(express.json());

//routes
app.use('/api/', authRouter);
app.use('/api/', userRouter);


app.listen(5000, () => {
    console.log('listening to port 5000...');
})