// // sockets/socket.js

// const { Group, UserGroup } = require('../models');

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
