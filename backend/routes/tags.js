const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Lista tutti i tag (pubblico o protetto? qui protetto per coerenza)
router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, name FROM tags ORDER BY name ASC');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Errore nel recupero dei tag:', err);
        res.status(500).json({ msg: 'Errore del server' });
    }
});

module.exports = router;

