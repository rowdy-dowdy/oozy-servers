const router = require('express').Router()
const user = require('../controllers/user.js')
const { isAuth } = require('../middleware/authMiddleware.js')

router.get('/rand/:limit', isAuth, user.getRandomUser)

router.get('/id/:id', user.getUserById)

router.get('/username/:username', user.getUserByUsername)

router.get('/email/:email', user.getUserByEmail)

router.get('/phone/:phone', user.getUserByPhone)

router.post('/id/:id/edit', isAuth, user.updateUserById)

module.exports = router