const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const path = require('path');
const dotenv = require('dotenv');

// Configurazione di dotenv per caricare le variabili d'ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Verifica della connessione al database
// Inseriamo questa logica in un blocco try-catch per gestire gli errori
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('🎉 Connesso al database MySQL con successo!');
        connection.release(); // Rilascia la connessione dopo il test
    } catch (err) {
        console.error('❌ Errore di connessione al database:', err.message);
        process.exit(1); // Uscita forzata in caso di errore critico
    }
})();

// Endpoint di test
app.get('/', (req, res) => {
    res.send('Server del Travel Journal App in funzione!');
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
});