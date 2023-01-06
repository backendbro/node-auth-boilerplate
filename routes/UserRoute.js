const router = require('express').Router()
const UserAuth = require('../services/UserService')

router.post('/register', UserAuth.register)
router.post('/login', UserAuth.login)
router.post('/forgot-password', UserAuth.forgotPassword)
router.post('/resend-pin', UserAuth.resendPin)
router.put('/reset-password/', UserAuth.resetPassword)
router.put('/reset-current-password/', UserAuth.resetCurrentPassword)


module.exports = router 