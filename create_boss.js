const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function createBossUser() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const email = 'boss@mentalvip.com';
        const passwordPlain = 'Elite123';
        const passwordHash = await bcrypt.hash(passwordPlain, 10);

        // Elimino se esiste già per ricrearlo pulito
        await connection.execute('DELETE FROM users WHERE email = ?', [email]);

        // Inserisco il Boss
        const query = `
            INSERT INTO users 
            (nome, cognome, cf, data_nascita, sesso, comune_nascita, cap, email, password_hash, doc_type, is_verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.execute(query, [
            'Mental', 'Boss', 'MNTBSS80A01H501X', '1980-01-01', 'M', 'ROMA', '00100', 
            email, passwordHash, 'ci', true
        ]);

        console.log(`✅ Utente BOSS creato: ${email} / ${passwordPlain}`);
        await connection.end();

    } catch (error) {
        console.error("❌ Errore:", error);
    }
}

createBossUser();