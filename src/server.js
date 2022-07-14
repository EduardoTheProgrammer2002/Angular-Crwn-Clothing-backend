const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const corOptions = {credential: true, origin: process.env.url || "*"};

app.use(cors(corOptions));
app.use(cookieParser());
app.use(express.json());


app.listen(5000, () => {
    console.log('listening to port 5000...');
})