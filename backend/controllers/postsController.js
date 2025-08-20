const pool = require('../config/db');

const createPost = async (req, res) => {
    const { title, description, location, latitude, longitude, mood, positive_note, negative_note, physical_effort, economic_effort, actual_cost, media_url } = req.body;
    const userId = req.user; // L'ID dell'utente viene aggiunto dal middleware di autenticazione

    try {
        const [result] = await pool.execute(
            'INSERT INTO posts (user_id, title, description, location, latitude, longitude, mood, positive_note, negative_note, physical_effort, economic_effort, actual_cost, media_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, title, description, location, latitude, longitude, mood, positive_note, negative_note, physical_effort, economic_effort, actual_cost, media_url]
        );

        res.status(201).json({ id: result.insertId, msg: 'Post creato con successo!' });
    } catch (err) {
        console.error('Errore nella creazione del post:', err);
        res.status(500).json({ msg: 'Errore del server' });
    }
};

const getPosts = async (req, res) => {
    const userId = req.user;

    try {
        const [rows] = await pool.execute('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Errore nel recupero dei post:', err);
        res.status(500).json({ msg: 'Errore del server' });
    }
};

const getPostById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user;

    try {
        const [rows] = await pool.execute('SELECT * FROM posts WHERE id = ? AND user_id = ?', [id, userId]);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Post non trovato o non autorizzato' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Errore nel recupero del post:', err);
        res.status(500).json({ msg: 'Errore del server' });
    }
};

const updatePost = async (req, res) => {
    const { id } = req.params;
    const userId = req.user;
    const { title, description, location, latitude, longitude, mood, positive_note, negative_note, physical_effort, economic_effort, actual_cost, media_url } = req.body;

    try {
        const [result] = await pool.execute(
            'UPDATE posts SET title = ?, description = ?, location = ?, latitude = ?, longitude = ?, mood = ?, positive_note = ?, negative_note = ?, physical_effort = ?, economic_effort = ?, actual_cost = ?, media_url = ? WHERE id = ? AND user_id = ?',
            [title, description, location, latitude, longitude, mood, positive_note, negative_note, physical_effort, economic_effort, actual_cost, media_url, id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Post non trovato o non autorizzato' });
        }
        res.status(200).json({ msg: 'Post aggiornato con successo!' });
    } catch (err) {
        console.error('Errore nell\'aggiornamento del post:', err);
        res.status(500).json({ msg: 'Errore del server' });
    }
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    const userId = req.user;

    try {
        const [result] = await pool.execute('DELETE FROM posts WHERE id = ? AND user_id = ?', [id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Post non trovato o non autorizzato' });
        }
        res.status(200).json({ msg: 'Post eliminato con successo!' });
    } catch (err) {
        console.error('Errore nell\'eliminazione del post:', err);
        res.status(500).json({ msg: 'Errore del server' });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
};