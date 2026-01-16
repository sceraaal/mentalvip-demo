const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function debugProvinces() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Contiamo quante righe hanno la provincia impostata
        const [rows] = await connection.execute("SELECT COUNT(*) as count FROM cities WHERE prov IS NOT NULL AND prov != ''");
        console.log("📊 Comuni con provincia valida:", rows[0].count);

        // Vediamo le prime 5 province uniche
        const [provs] = await connection.execute("SELECT DISTINCT prov FROM cities LIMIT 5");
        console.log("🔍 Esempio province:", provs);

        await connection.end();
    } catch (e) {
        console.error("❌ Errore DB:", e);
    }
}

debugProvinces();