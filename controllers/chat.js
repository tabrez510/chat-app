const Chat = require('../models/chat');
const Sequelize = require('sequelize');

exports.createChat = async(req, res) => {
    try {
        const {message} = req.body;
        const mesg = await Chat.create({message, name: req.user.name, userId: req.user.id});
        res.json({success: true, ...mesg.dataValues});
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Internal Server Error'});
    }
}

exports.getChats = async(req, res) => {
    try {
        const lastId = req.query.lastMesgId;
        let messages;

        if (lastId) {
            messages = await Chat.findAll({
                where: {
                    id: {
                        [Sequelize.Op.gt]: lastId
                    }
                }
            });
        } else {
            messages = await Chat.findAll();
        }
        console.log(messages);
        res.json(messages.map((mesg) => mesg.dataValues));
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Internal Server Error'});
    }
}