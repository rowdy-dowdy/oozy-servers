const router = require('express').Router()
const auth = require('../controllers/auth.js')
const { isAuth } = require('../middleware/authMiddleware.js')

router.post('/login', auth.login)

router.get('/logged', isAuth, auth.logged)

router.post('/register', auth.register)

module.exports = router