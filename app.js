const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const sequelize = require('./utils/database');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group');

const User = require('./models/user');
const Chat = require('./models/chat');
const Group = require('./models/Group');
const UserGroup = require('./models/UserGroup');

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5501"
}));

app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/user', chatRoutes);
app.use('/api/user', groupRoutes);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

sequelize
    .sync({force: true})
    .then((res) => {
        app.listen(PORT);
    })
    .catch((err) => {
        console.log(err);
    })