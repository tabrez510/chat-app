const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');
const userAuthentication = require('../middlewares/auth');

router.post('/create-group', userAuthentication.authenticate, groupController.createGroup);
router.post('/add-user/:groupId', userAuthentication.authenticate, groupController.addUserToGroup);
router.post('/remove-user/:groupId', userAuthentication.authenticate, groupController.removeUserFromGroup);
router.post('/make-admin', userAuthentication.authenticate, groupController.makeAdmin);
router.post('/remove-admin', userAuthentication.authenticate, groupController.removeAdmin);
router.get('/get-group-users/:groupId', groupController.getGroupUsers);
router.get('/get-available-users/:groupId', groupController.getAvailableUsersForGroup);

module.exports = router;