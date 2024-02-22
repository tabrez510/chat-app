const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const sequelize = require('./utils/database');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/api/user', userRoutes);


sequelize
    .sync({force: false})
    .then((res) => {
        app.listen(PORT);
    })
    .catch((err) => {
        console.log(err);
    })