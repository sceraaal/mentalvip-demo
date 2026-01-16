const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mysql = require('mysql2/promise');

async function setupDatabase() {
    console.log("🔄 Avvio setup globale del database...");

    try {
        // 1. Connessione a MySQL
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log("✅ Connesso a MySQL.");

        // 2. Creazione Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS 
${process.env.DB_NAME}
;`);
        console.log(`✅ Database '${process.env.DB_NAME}' verificato.`);

        await connection.changeUser({ database: process.env.DB_NAME });

        // 3. Creazione Tabella UTENTI
        const usersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                cognome VARCHAR(100) NOT NULL,
                cf VARCHAR(16) NOT NULL UNIQUE,
                data_nascita DATE NOT NULL,
                sesso ENUM('M', 'F') NOT NULL,
                comune_nascita VARCHAR(100) NOT NULL,
                cap VARCHAR(5) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                doc_type ENUM('ci', 'pass', 'dl') NOT NULL,
                doc_front_path VARCHAR(255),
                doc_back_path VARCHAR(255),
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await connection.query(usersTable);
        console.log("✅ Tabella 'users' verificata.");

        // 4. Creazione Tabella SIGNALS (Le Giocate)
        const signalsTable = `
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
        await connection.query(signalsTable);
        console.log("✅ Tabella 'signals' verificata.");

        console.log("\n🚀 SETUP COMPLETATO CON SUCCESSO!");
        await connection.end();

    } catch (error) {
        console.error("❌ ERRORE DURANTE IL SETUP:", error.message);
    }
}

setupDatabase();
