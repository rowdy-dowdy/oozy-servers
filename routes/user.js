const router = require('express').Router()
const user = require('../controllers/user.js')
const { isAuth } = require('../middleware/authMiddleware.js')


router.get('/:id', isAuth, user.getUserById)

router.post('/:id/edit', isAuth, user.updateUserById)

module.exports = router