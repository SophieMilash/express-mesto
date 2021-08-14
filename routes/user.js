const router = require('express').Router();

const {
  getUsers, getUserById, getCurrentUser, updateUser, updateUserAvatar,
} = require('../controllers/users');
const { userIdValidation, userValidation, avatarValidation } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', userIdValidation, getUserById);
router.patch('/me', userValidation, updateUser);
router.patch('/me/avatar', avatarValidation, updateUserAvatar);

module.exports = router;
