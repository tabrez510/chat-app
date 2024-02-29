const Chat = require('../models/chat');
const Sequelize = require('sequelize');

exports.createChat = async(req, res) => {
    try {
        const {gorupId, message} = req.body;
        const mesg = await Chat.create({message, name: req.user.name, userId: req.user.id, gorupId});
        res.json({success: true, ...mesg.dataValues, message: 'Message sent successfully'});
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Internal Server Error'});
    }
}

exports.getChats = async(req, res) => {
    try {
        const lastId = req.query.lastMesgId;
        const groupId = req.params.groupId;
        let messages;

        if (lastId) {
            messages = await Chat.findAll({
                where: {
                    id: {
                        [Sequelize.Op.gt]: lastId
                    },
                    groupId
                }
            });
        } else {
            messages = await Chat.findAll({
                where : {
                    groupId
                }
            });
        }
        console.log(messages);
        res.json(messages.map((mesg) => mesg.dataValues));
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Internal Server Error'});
    }
}