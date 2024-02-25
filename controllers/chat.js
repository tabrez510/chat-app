const Chat = require('../models/chat');

exports.createChat = async(req, res) => {
    try {

        const {message} = req.body;
        const mesg = await Chat.create({message, userId: req.user.id});
        res.json({success: true, ...mesg.dataValues});
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Internal Server Error'});
    }
}