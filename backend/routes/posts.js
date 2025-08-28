const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const auth = require('../middleware/auth');

// Rotte protette dal middleware di autenticazione
// L'utente deve essere loggato per accedere a queste rotte

// Creare un nuovo post
router.post('/', auth, postsController.createPost);

// Ottenere tutti i post dell'utente loggato
router.get('/', auth, postsController.getPosts);

// Ottenere un singolo post per ID
router.get('/:id', auth, postsController.getPostById);

// Aggiornare un post esistente
router.put('/:id', auth, postsController.updatePost);

// Eliminare un post
router.delete('/:id', auth, postsController.deletePost);

module.exports = router;
