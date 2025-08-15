const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route per la registrazione di un nuovo utente
router.post('/register', authController.register);

// Route per il login di un utente esistente
router.post('/login', authController.login);

module.exports = router;