const express = require('express');
const authController = require('../controllers/auth');
const { sanitizeInput } = require('../helper/sanitize');

const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", sanitizeInput, authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post("/signup", sanitizeInput, authController.postSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);



module.exports = router;