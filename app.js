const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const sequelize = require('./utils/database');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');

const User = require('./models/user');
const Chat = require('./models/chat');

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5501"
}));

app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/user', chatRoutes);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

User.hasMany(Chat);
Chat.belongsTo(User);

sequelize
    .sync({force: false})
    .then((res) => {
        app.listen(PORT);
    })
    .catch((err) => {
        console.log(err);
    })