const router = require('express').Router()
const messages = require('../controllers/messages.js')
const { isAuth } = require('../middleware/authMiddleware.js')


router.get('', isAuth, messages.getAllMessagesGroupId)

router.post('/create', isAuth, messages.createMessagesGroup)

router.get('/group/:id', isAuth, messages.getMessagesGroupById)

router.post('/group/:id/add', isAuth, messages.sendMessagesToGroup)

module.exports = router