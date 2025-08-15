const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

// Creazione di un pool di connessioni
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verifichiamo la connessione all'avvio
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('🎉 Connesso al database MySQL con successo!');
        connection.release();
    } catch (err) {
        console.error('❌ Errore di connessione al database:', err.message);
        process.exit(1); // Uscita dal processo in caso di errore
    }
}

testConnection();

// Esportiamo il pool di connessioni per usarlo in altre parti del server
module.exports = pool;