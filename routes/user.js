// Create a basic CRUD API on Router level
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.get('/', UserController.get_all_users);
router.get('/list', UserController.get_all_user_list);
router.post('/activate', UserController.user_activation);
router.get('/:userId', UserController.get_user);
router.patch('/:userId', UserController.update_user);
router.delete('/:userId', UserController.delete_user);


module.exports = router;