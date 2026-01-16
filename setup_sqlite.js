const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const readline = require('readline');
const bcrypt = require('bcrypt');
const path = require('path');

const DB_PATH = path.join(__dirname, 'mentalvip.db');
const CSV_PATH = '/Users/simonasceral/Downloads/listacomuni.txt';

const db = new sqlite3.Database(DB_PATH);

db.serialize(async () => {
    console.log("🔄 Inizializzazione SQLite...");

    // 1. Tabelle
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT, cognome TEXT, cf TEXT UNIQUE, data_nascita TEXT, sesso TEXT,
        comune_nascita TEXT, cap TEXT, email TEXT UNIQUE, password_hash TEXT,
        doc_type TEXT, is_verified INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS signals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sport TEXT, competition TEXT, match_name TEXT, strategy TEXT, odds REAL,
        label TEXT, link TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT, cap TEXT, prov TEXT, belfiore TEXT
    )`);

    console.log("✅ Tabelle create.");

    // 2. Utente BOSS
    const hash = await bcrypt.hash('Elite123', 10);
    db.run(`DELETE FROM users WHERE email = 'boss@mentalvip.com'`);
    db.run(`INSERT INTO users (email, password_hash, nome, cognome, cf, role) VALUES (?, ?, ?, ?, ?, ?)`, 
        ['boss@mentalvip.com', hash, 'Mental', 'Boss', 'MNTBSS80A01H501X', 'elite'], 
        (err) => {
            if (!err) console.log("✅ Boss User creato.");
        }
    );

    // 3. Importazione Comuni (Stream)
    if (fs.existsSync(CSV_PATH)) {
        console.log("📥 Avvio importazione comuni...");
        db.run("BEGIN TRANSACTION");
        
        const stmt = db.prepare("INSERT INTO cities (nome, cap, prov, belfiore) VALUES (?, ?, ?, ?)");
        const fileStream = fs.createReadStream(CSV_PATH);
        const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

        let count = 0;
        let header = true;

        for await (const line of rl) {
            if (header) { header = false; continue; }
            const cols = line.split(';');
            if (cols.length > 6) {
                stmt.run(cols[1].toUpperCase(), cols[5], cols[2], cols[6]);
                count++;
            }
        }

        stmt.finalize();
        db.run("COMMIT", () => {
            console.log(`✅ Importati ${count} comuni.`);
            db.close();
        });
    } else {
        console.error("❌ File comuni non trovato in:", CSV_PATH);
        db.close();
    }
});