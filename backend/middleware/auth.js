const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Corretto: percorso per db.js
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        // Recupera il token dall'header Authorization
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ msg: 'Nessun token, autorizzazione negata' });
        }

        // Controlla che il token abbia il prefisso "Bearer"
        const token = authHeader.replace('Bearer ', '');

        // Verifica il token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Aggiungi l'id dell'utente alla richiesta per renderlo disponibile nelle route successive
        req.user = decoded.id;

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token non valido' });
    }
};

module.exports = auth;