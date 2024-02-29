const Group = require('../models/Group');
const UserGroup = require('../models/UserGroup');
const User = require('../models/user');

async function adminChecker(userId, groupId){
    try {
        const user = await UserGroup.findOne({
            where: {
                userId,
                groupId
            }
        });
        return user.isAdmin;
    } catch(err) {
        console.log(err);
    }
}

exports.createGroup = async (req, res) => {
    try {
        const {name} = req.body;
        const userId = req.user.id;
        const group = await Group.create({name});
        await UserGroup.create({isAdmin: true, userId, groupId: group.id});
        res.json({success: true, message: "Group created successfully", ...group.dataValues});
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

exports.addUserToGroup = async (req, res) => {
    try {
        const { userId } = req.body;
        const groupId = req.params.groupId;
        if(adminChecker(req.user.id, groupId)){
            await UserGroup.create({isAdmin: false, userId, groupId});
            res.json({success: true, message: "User added successfully"});
        } else {
            res.json({success: false, message: "You are not an admin"})
        }
    }catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

exports.removeUserFromGroup = async (req, res) => {
    try {
        const { userId } = req.body;
        const groupId = req.params.groupId;
        if(adminChecker(req.user.id, groupId)){
            await UserGroup.destroy({
                where : {
                    userId,
                    groupId
                }
            })
            res.json({success: false, message: "User removed from group successfully"});
        } else {
            res.json({success: false, message: "You are not an admin"})
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

exports.makeAdmin = async (req, res) => {
    try {
        const { userId, groupId } = req.body;
        if(adminChecker(req.user.id, groupId)){
            await UserGroup.update({ isAdmin: true }, { where: { userId, groupId } });
            res.json({ success: true, message: 'User made admin successfully' });
        } else {
            res.json({success: false, message: "You are not an admin"})
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.removeAdmin = async (req, res) => {
    try {
        const { userId, groupId } = req.body;
        if(adminChecker(req.user.id, groupId)){
            await UserGroup.update({ isAdmin: false }, { where: { userId, groupId } });
            res.json({ success: true, message: 'User made admin successfully' });
        } else {
            res.json({success: false, message: "You are not an admin"})
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.getGroupUsers = async (req, res) => {
    try {
        const groupId = req.params.groupId;

        const usersInGroup = await User.findAll({
            include: [{
                model: UserGroup,
                where: { groupId },
                attributes: ['isAdmin'], // Include only isAdmin column
            }],
            order: [
                [{ model: UserGroup }, 'isAdmin', 'DESC'] // Sort by isAdmin in descending order
            ]
        });
    
        res.json(usersInGroup.map((user) => user.dataValues));
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

exports.getAvailableUsersForGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;

        // Find users who are not part of the specified group
        const usersNotInGroup = await User.findAll({
            where: {
                id: {
                    [sequelize.Op.notIn]: sequelize.literal(
                        `(SELECT "userId" FROM "userGroup" WHERE "groupId" = ${groupId})`
                    )
                }
            }
        });

        res.json(usersNotInGroup.map((user) => user.dataValues));
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};