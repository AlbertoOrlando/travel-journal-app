const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Corretto: il percorso del file
const dotenv = require('dotenv');

// Importiamo i router
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

// Configurazione di dotenv per caricare le variabili d'ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Verifica della connessione al database
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('🎉 Connesso al database MySQL con successo!');
        connection.release();
    } catch (err) {
        console.error('❌ Errore di connessione al database:', err.message);
        process.exit(1);
    }
})();

// Definizione delle route API
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

// Avvio del server
app.listen(PORT, () => {
    console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
});