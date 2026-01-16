const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function checkCity() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Cerco Nocera
        const [rows] = await connection.execute("SELECT * FROM cities WHERE nome LIKE 'NOCERA%'");
        console.log("🔍 Risultati DB per 'NOCERA':", rows);

        await connection.end();
    } catch (e) {
        console.error("❌ Errore:", e);
    }
}

checkCity();