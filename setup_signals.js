const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function createSignalsTable() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Query Creazione Tabella Segnali
        const query = `
            CREATE TABLE IF NOT EXISTS signals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sport ENUM('tennis', 'soccer') NOT NULL,
                competition VARCHAR(100),
                match_name VARCHAR(150) NOT NULL,
                strategy VARCHAR(150),
                odds DECIMAL(5, 2),
                label VARCHAR(50),
                link TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await connection.query(query);
        console.log("✅ Tabella 'signals' creata (o già esistente) con successo!");
        await connection.end();

    } catch (error) {
        console.error("❌ Errore:", error);
    }
}

createSignalsTable();