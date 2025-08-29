const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurazione di Nodemailer con TLS compatibile Windows/macOS
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, // permette invio anche con certificati autofirmati
    },
});

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Inserisci tutti i campi' });
    }
    if (password.length < 6) {
        return res.status(400).json({ msg: 'La password deve avere almeno 6 caratteri' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '2d' });

        // Opzioni per l'email di conferma
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Conferma Registrazione al Travel Journal App',
            text: `Benvenuto, ${username}! La tua registrazione è andata a buon fine. Inizia il tuo viaggio!`,
            html: `<p>Ciao <strong>${username}</strong>,</p><p>La tua registrazione al <strong>Travel Journal App</strong> è andata a buon fine. Preparati a raccontare le tue avventure!</p>`,
        };

        // Invio dell'email con gestione errori
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('❌ Errore invio email:', error.message);
            } else {
                console.log('✅ Email inviata:', info.response);
            }
        });

        res.status(201).json({
            token,
            user: { id: result.insertId, username, email },
            msg: 'Utente registrato con successo! Controlla la tua email per la conferma.'
        });
    } catch (err) {
        console.error('Errore di registrazione:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ msg: 'Username o email già esistenti' });
        }
        res.status(500).json({ msg: 'Errore del server' });
    }
};

const login = async (req, res) => {
    const { email, username, identifier, password } = req.body;
    const loginId = identifier || email || username; // supporta sia email che username

    if (!loginId || !password) {
        return res.status(400).json({ msg: 'Inserisci email/username e password' });
    }
    if (password.length < 6) {
        return res.status(400).json({ msg: 'La password deve avere almeno 6 caratteri' });
    }

    try {
        // Cerca per email O username
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1',
            [loginId, loginId]
        );
        const user = rows[0];

        if (!user) {
            return res.status(400).json({ msg: 'Credenziali non valide' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenziali non valide' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            user: { id: user.id, username: user.username, email: user.email },
            msg: 'Login effettuato con successo!'
        });
    } catch (err) {
        console.error('Errore di login:', err);
        res.status(500).json({ msg: 'Errore del server' });
    }
};

module.exports = { register, login };
