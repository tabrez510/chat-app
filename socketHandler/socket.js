// // sockets/socket.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Group = require('../models/group');
const UserGroup = require('../models/usergroup');

module.exports = (io) => {
    io.on('connection', async(socket) => {
        console.log('User connected: ', socket.id);
        const token = socket.handshake.query.token;
        // first update socket id in user table and join all the available rooms
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            
            const userId = decoded.userId;

            const user = await User.findByPk(userId);
            if (user) {
                user.socketId = socket.id;
                await user.save();
                console.log(`Socket ID updated for user ${userId}: ${socket.id}`);

                // find all the groups of user and join him in that room
                const userGroups = await UserGroup.findAll({
                    where: {
                        userId
                    },
                    include: [{ model: Group }],
                    order: [[Group, 'lastActivity', 'DESC']],
                });

                userGroups.forEach((userGroup) => socket.join(userGroup.groupId));
            } else {
                console.log(`User with ID ${userId} not found.`);
            }
        } catch (error) {
            console.error('Authentication error:', error);
        }

        socket.on('disconnect', () => {
            console.log('User disconnected: ', socket.id);
        });
    });
}

// module.exports = (io) => {
//     io.on('connection', (socket) => {
//         console.log('User connected: ', socket.id);

//         socket.on('joinGroup', async (groupId) => {
//             socket.join(groupId);
//             console.log(`Socket ${socket.id} joined group ${groupId}`);
//         });

//         socket.on('createGroup', async ({ name, userId }) => {
//             try {
//                 const group = await Group.create({ name });
//                 await UserGroup.create({ isAdmin: true, userId, groupId: group.id });
//                 io.emit('groupCreated', group);
//             } catch (err) {
//                 console.error('Error creating group:', err);
//             }
//         });

//         socket.on('addUserToGroup', async ({ userId, groupId }) => {
//             try {
//                 await UserGroup.create({ isAdmin: false, userId, groupId });
//                 io.to(groupId).emit('userAddedToGroup', userId);
//             } catch (err) {
//                 console.error('Error adding user to group:', err);
//             }
//         });

//         socket.on('removeUserFromGroup', async ({ userId, groupId }) => {
//             try {
//                 await UserGroup.destroy({
//                     where: {
//                         userId,
//                         groupId
//                     }
//                 });
//                 io.to(groupId).emit('userRemovedFromGroup', userId);
//             } catch (err) {
//                 console.error('Error removing user from group:', err);
//             }
//         });

//         socket.on('makeAdmin', async ({ userId, groupId }) => {
//             try {
//                 await UserGroup.update({ isAdmin: true }, { where: { userId, groupId } });
//                 io.to(groupId).emit('adminMade', userId);
//             } catch (err) {
//                 console.error('Error making admin:', err);
//             }
//         });

//         socket.on('removeAdmin', async ({ userId, groupId }) => {
//             try {
//                 await UserGroup.update({ isAdmin: false }, { where: { userId, groupId } });
//                 io.to(groupId).emit('adminRemoved', userId);
//             } catch (err) {
//                 console.error('Error removing admin:', err);
//             }
//         });

//         socket.on('sendMessage', async ({ groupId, message, userId }) => {
//             try {
//                 // Save message to database
//                 const chat = await Chat.create({ groupId, message, userId });
                
//                 // Emit the message to all users in the group
//                 io.to(groupId).emit('newMessage', chat);
//             } catch (err) {
//                 console.error('Error sending message:', err);
//             }
//         });

//         socket.on('disconnect', () => {
//             console.log('User disconnected: ', socket.id);
//         });
//     });
// };
