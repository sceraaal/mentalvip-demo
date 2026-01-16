const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const DB_PATH = path.join(__dirname, 'mentalvip.db');
const db = new sqlite3.Database(DB_PATH);

async function resetBoss() {
    const email = 'boss@mentalvip.com';
    const password = 'MentalBoss2026';
    const hash = await bcrypt.hash(password, 10);

    db.serialize(() => {
        // Elimina se esiste
        db.run(`DELETE FROM users WHERE email = ?`, [email]);

        // Crea Nuovo
        db.run(`INSERT INTO users (nome, cognome, cf, data_nascita, sesso, comune_nascita, cap, email, password_hash, doc_type, is_verified, role) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                ['Mental', 'Boss', 'MNTBSS80A01H501X', '1980-01-01', 'M', 'ROMA', '00100', email, hash, 'ci', 1, 'elite'],
                (err) => {
                    if (err) console.error("❌ Errore:", err.message);
                    else console.log(`✅ Utente BOSS ricreato!\n📧 Email: ${email}\n🔑 Password: ${password}`);
                }
        );
    });
}

resetBoss();
