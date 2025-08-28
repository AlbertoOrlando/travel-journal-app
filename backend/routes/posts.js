const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurazione Multer per upload locali
const uploadDir = path.join(__dirname, '..', 'uploads');
// Assicura che la cartella esista
try { fs.mkdirSync(uploadDir, { recursive: true }); } catch {}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${Date.now()}_${safeName}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/ogg',
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Tipo di file non supportato'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });

// Rotte protette dal middleware di autenticazione
// L'utente deve essere loggato per accedere a queste rotte

// Creare un nuovo post (supporta upload file come campo 'media_file')
router.post('/', auth, upload.single('media_file'), postsController.createPost);

// Ottenere tutti i post dell'utente loggato
router.get('/', auth, postsController.getPosts);

// Ottenere un singolo post per ID
router.get('/:id', auth, postsController.getPostById);

// Aggiornare un post esistente (supporta upload file)
router.put('/:id', auth, upload.single('media_file'), postsController.updatePost);

// Eliminare un post
router.delete('/:id', auth, postsController.deletePost);

module.exports = router;
