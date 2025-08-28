const pool = require('../config/db');

// Helpers per TAGS
async function upsertTagsAndLink(connection, postId, tagNames) {
    if (!Array.isArray(tagNames) || tagNames.length === 0) return;
    // Normalizza nomi tag
    const names = [...new Set(tagNames.map((t) => String(t).trim()).filter(Boolean))];
    if (names.length === 0) return;

    // Trova tag esistenti
    const [existing] = await connection.execute(
        `SELECT id, name FROM tags WHERE name IN (${names.map(() => '?').join(',')})`,
        names
    );
    const existingMap = new Map(existing.map((row) => [row.name, row.id]));

    // Inserisci mancanti
    const missing = names.filter((n) => !existingMap.has(n));
    if (missing.length > 0) {
        // Inserimenti individuali per semplicità/compatibilità
        for (const n of missing) {
            const [res] = await connection.execute('INSERT INTO tags (name) VALUES (?)', [n]);
            existingMap.set(n, res.insertId);
        }
    }

    // Collega tag al post (evita duplicati)
    for (const n of names) {
        const tagId = existingMap.get(n);
        await connection.execute(
            'INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)',
            [postId, tagId]
        );
    }
}

async function replacePostTags(connection, postId, tagNames) {
    await connection.execute('DELETE FROM post_tags WHERE post_id = ?', [postId]);
    await upsertTagsAndLink(connection, postId, tagNames);
}

async function attachTagsToPosts(connection, posts) {
    if (!Array.isArray(posts) || posts.length === 0) return posts;
    const ids = posts.map((p) => p.id);
    const [rows] = await connection.execute(
        `SELECT pt.post_id, t.name
         FROM post_tags pt
         JOIN tags t ON t.id = pt.tag_id
         WHERE pt.post_id IN (${ids.map(() => '?').join(',')})`,
        ids
    );
    const map = new Map();
    for (const r of rows) {
        if (!map.has(r.post_id)) map.set(r.post_id, []);
        map.get(r.post_id).push(r.name);
    }
    return posts.map((p) => ({ ...p, tags: map.get(p.id) || [] }));
}

const createPost = async (req, res) => {
    const {
        title,
        description,
        location,
        latitude,
        longitude,
        mood,
        positive_note,
        negative_note,
        physical_effort,
        economic_effort,
        actual_cost,
        media_url,
        tags,
    } = req.body || {};
    const userId = req.user; // L'ID dell'utente viene aggiunto dal middleware di autenticazione

    // Validazione minima
    if (!title || !description) {
        return res.status(400).json({ msg: 'Titolo e descrizione sono obbligatori' });
    }

    // Normalizza valori opzionali per evitare errori MySQL su tipi non validi
    const strOrNull = (v) => (v === undefined || v === null || v === '' ? null : String(v));
    const intOrNull = (v) => {
        const n = parseInt(v, 10);
        return Number.isFinite(n) ? n : null;
    };
    const floatOrNull = (v) => {
        const n = parseFloat(v);
        return Number.isFinite(n) ? n : null;
    };

    const phys = intOrNull(physical_effort);
    const econ = intOrNull(economic_effort);
    if (phys !== null && (phys < 1 || phys > 5)) {
        return res.status(400).json({ msg: 'physical_effort deve essere tra 1 e 5' });
    }
    if (econ !== null && (econ < 1 || econ > 5)) {
        return res.status(400).json({ msg: 'economic_effort deve essere tra 1 e 5' });
    }

    // Determina media_url: preferisci file upload se presente
    let finalMediaUrl = strOrNull(media_url);
    if (req.file && req.file.filename) {
        finalMediaUrl = `/uploads/${req.file.filename}`;
    }

    const values = [
        userId,
        String(title),
        String(description),
        strOrNull(location),
        floatOrNull(latitude),
        floatOrNull(longitude),
        strOrNull(mood),
        strOrNull(positive_note),
        strOrNull(negative_note),
        phys,
        econ,
        floatOrNull(actual_cost),
        finalMediaUrl,
    ];

    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.execute(
            'INSERT INTO posts (user_id, title, description, location, latitude, longitude, mood, positive_note, negative_note, physical_effort, economic_effort, actual_cost, media_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            values
        );

            // Gestione tags opzionali (array o string JSON o CSV)
            let tagList = tags;
            if (typeof tagList === 'string') {
                try {
                    const parsed = JSON.parse(tagList);
                    if (Array.isArray(parsed)) tagList = parsed;
                    else tagList = String(tagList).split(',');
                } catch {
                    tagList = String(tagList).split(',');
                }
            }
            if (Array.isArray(tagList) && tagList.length > 0) {
                await upsertTagsAndLink(connection, result.insertId, tagList);
            }

            await connection.commit();
            res.status(201).json({ id: result.insertId, msg: 'Post creato con successo!' });
        } catch (e) {
            await connection.rollback();
            throw e;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Errore nella creazione del post:', err);
        res.status(500).json({ msg: 'Errore del server' });
    }
};

const getPosts = async (req, res) => {
    const userId = req.user;

    try {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC',
                [userId]
            );
            const withTags = await attachTagsToPosts(connection, rows);
            res.status(200).json(withTags);
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Errore nel recupero dei post:', err);
        res.status(500).json({ msg: 'Errore del server' });
    }
};

const getPostById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user;

    try {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM posts WHERE id = ? AND user_id = ?',
                [id, userId]
            );
            if (rows.length === 0) {
                return res.status(404).json({ msg: 'Post non trovato o non autorizzato' });
            }
            const [withTags] = await attachTagsToPosts(connection, rows);
            res.status(200).json(withTags || rows[0]);
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Errore nel recupero del post:', err);
        res.status(500).json({ msg: 'Errore del server' });
    }
};

const updatePost = async (req, res) => {
    const { id } = req.params;
    const userId = req.user;
    const {
        title,
        description,
        location,
        latitude,
        longitude,
        mood,
        positive_note,
        negative_note,
        physical_effort,
        economic_effort,
        actual_cost,
        media_url,
        tags,
    } = req.body || {};

    if (!title || !description) {
        return res.status(400).json({ msg: 'Titolo e descrizione sono obbligatori' });
    }

    const strOrNull = (v) => (v === undefined || v === null || v === '' ? null : String(v));
    const intOrNull = (v) => {
        const n = parseInt(v, 10);
        return Number.isFinite(n) ? n : null;
    };
    const floatOrNull = (v) => {
        const n = parseFloat(v);
        return Number.isFinite(n) ? n : null;
    };

    const phys = intOrNull(physical_effort);
    const econ = intOrNull(economic_effort);
    if (phys !== null && (phys < 1 || phys > 5)) {
        return res.status(400).json({ msg: 'physical_effort deve essere tra 1 e 5' });
    }
    if (econ !== null && (econ < 1 || econ > 5)) {
        return res.status(400).json({ msg: 'economic_effort deve essere tra 1 e 5' });
    }

    // Determina media_url finale
    let finalMediaUrl = strOrNull(media_url);
    if (req.file && req.file.filename) {
        finalMediaUrl = `/uploads/${req.file.filename}`;
    }

    const values = [
        String(title),
        String(description),
        strOrNull(location),
        floatOrNull(latitude),
        floatOrNull(longitude),
        strOrNull(mood),
        strOrNull(positive_note),
        strOrNull(negative_note),
        phys,
        econ,
        floatOrNull(actual_cost),
        finalMediaUrl,
        id,
        userId,
    ];

    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.execute(
                'UPDATE posts SET title = ?, description = ?, location = ?, latitude = ?, longitude = ?, mood = ?, positive_note = ?, negative_note = ?, physical_effort = ?, economic_effort = ?, actual_cost = ?, media_url = ? WHERE id = ? AND user_id = ?',
                values
            );

            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({ msg: 'Post non trovato o non autorizzato' });
            }

            let tagList = tags;
            if (typeof tagList === 'string') {
                try {
                    const parsed = JSON.parse(tagList);
                    if (Array.isArray(parsed)) tagList = parsed;
                    else tagList = String(tagList).split(',');
                } catch {
                    tagList = String(tagList).split(',');
                }
            }
            if (Array.isArray(tagList)) {
                await replacePostTags(connection, id, tagList);
            }

            await connection.commit();
            res.status(200).json({ msg: 'Post aggiornato con successo!' });
        } catch (e) {
            await connection.rollback();
            throw e;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error("Errore nell'aggiornamento del post:", err);
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
