const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const register = async (req, res) => {
    const { username, email, password } = req.body;

    // Validazione di base
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Inserisci tutti i campi' });
    }

    try {
        // Generazione del sale e hashing della password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserimento dell'utente nel database
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // Creazione del token JWT
        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, msg: 'Utente registrato con successo!' });
    } catch (err) {
        console.error('Errore di registrazione:', err);
        // Gestione dell'errore per username o email duplicati
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ msg: 'Username o email già esistenti' });
        }
        res.status(500).json({ msg: 'Errore del server' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // Validazione di base
    if (!email || !password) {
        return res.status(400).json({ msg: 'Inserisci email e password' });
    }

    try {
        // Ricerca dell'utente tramite email
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        // Se l'utente non esiste
        if (!user) {
            return res.status(400).json({ msg: 'Credenziali non valide' });
        }

        // Confronto della password
        const isMatch = await bcrypt.compare(password, user.password);

        // Se la password non corrisponde
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenziali non valide' });
        }

        // Creazione del token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, msg: 'Login effettuato con successo!' });
    } catch (err) {
        console.error('Errore di login:', err);
        res.status(500).json({ msg: 'Errore del server' });
    }
};

module.exports = { register, login };