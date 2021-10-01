const router = require('express').Router()
const friendShips = require('../controllers/friendShips.js')
const { isAuth } = require('../middleware/authMiddleware.js')


router.get('', isAuth, friendShips.getAll)

router.get('/request-sent', isAuth, friendShips.getRequestSent)

router.get('/request-received', isAuth, friendShips.getRequestReceived)

router.get('/type/:id', isAuth, friendShips.getType)

router.post('/action/:id/add', isAuth, friendShips.create)

router.post('/action/:id/edit', isAuth, friendShips.confirm)

router.post('/action/:id/cancel', isAuth, friendShips.cancel)

// router.post('/action/:id/delete', isAuth, friendShips.destroy)

module.exports = router