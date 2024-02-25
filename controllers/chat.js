const Chat = require('../models/chat');

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
        const mesg = await Chat.findAll();
        res.json(mesg.map((message) =>message.dataValues));
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Internal Server Error'});
    }
}