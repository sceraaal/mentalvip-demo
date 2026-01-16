const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const DB_PATH = path.join(__dirname, 'mentalvip.db');
const db = new sqlite3.Database(DB_PATH);

async function fixAndReset() {
    const email = 'boss@mentalvip.com';
    const password = 'MentalBoss2026';
    const hash = await bcrypt.hash(password, 10);

    db.serialize(() => {
        // 1. Aggiungi colonna 'role' se manca
        db.run(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'free'`, (err) => {
            if (!err) console.log("✅ Colonna 'role' aggiunta.");
            else console.log("ℹ️  Colonna 'role' già presente o errore:", err.message);
        });

        // 2. Ricrea Boss
        db.run(`DELETE FROM users WHERE email = ?`, [email]);
        
        db.run(`INSERT INTO users (nome, cognome, cf, data_nascita, sesso, comune_nascita, cap, email, password_hash, doc_type, is_verified, role) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                ['Mental', 'Boss', 'MNTBSS80A01H501X', '1980-01-01', 'M', 'ROMA', '00100', email, hash, 'ci', 1, 'elite'],
                (err) => {
                    if (err) console.error("❌ Errore Insert:", err.message);
                    else console.log(`✅ Utente BOSS pronto!\n📧 Email: ${email}\n🔑 Pass: ${password}`);
                }
        );
    });
}

fixAndReset();
