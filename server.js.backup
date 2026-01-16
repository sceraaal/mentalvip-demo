const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'mentalvip.db');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); 

// Connessione SQLite
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) console.error("❌ Errore SQLite:", err.message);
    else console.log("✅ Connesso a SQLite.");
});

// Helper Promise per SQLite (per usare async/await)
const dbRun = (sql, params) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
        if(err) reject(err); else resolve(this);
    });
});

const dbGet = (sql, params) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
        if(err) reject(err); else resolve(row);
    });
});

const dbAll = (sql, params) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
        if(err) reject(err); else resolve(rows);
    });
});

const multer = require('multer');

// Configurazione Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
    filename: (req, file, cb) => cb(null, 'avatar-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Servire file statici Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Upload Avatar
app.post('/api/upload-avatar', upload.single('avatar'), async (req, res) => {
    try {
        const userId = req.body.userId;
        const filePath = '/uploads/' + req.file.filename;

        // Aggiorna DB (Uso un campo generico o aggiungo colonna 'avatar_url' se non c'è, qui uso doc_front_path per semplicità o creo colonna)
        // Meglio aggiungere colonna:
        try { await dbRun("ALTER TABLE users ADD COLUMN avatar_url TEXT"); } catch(e) {} 

        await dbRun("UPDATE users SET avatar_url = ? WHERE id = ?", [filePath, userId]);
        
        res.json({ success: true, url: filePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore upload" });
    }
});

// --- API AUTH ---
app.post('/api/register', async (req, res) => {
    try {
        const { nome, cognome, cf, dataNascita, sesso, comune, cap, email, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        
        await dbRun(`INSERT INTO users (nome, cognome, cf, data_nascita, sesso, comune_nascita, cap, email, password_hash) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                     [nome, cognome, cf, dataNascita, sesso, comune, cap, email, hash]);
        
        res.status(201).json({ message: "Registrato!" });
    } catch (err) {
        res.status(500).json({ error: "Errore (forse email/cf duplicati)" });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: "Credenziali errate" });
        }

        let role = 'free';
        if (email === 'boss@mentalvip.com') role = 'elite';

        res.json({ message: "OK", user: { id: user.id, nome: user.nome, role } });
    } catch (err) {
        res.status(500).json({ error: "Errore server" });
    }
});

// --- API GEOGRAFICHE ---
app.get('/api/provinces', async (req, res) => {
    try {
        const rows = await dbAll('SELECT DISTINCT prov FROM cities ORDER BY prov');
        res.json(rows);
    } catch (err) { res.status(500).json([]); }
});

app.get('/api/cities-by-prov', async (req, res) => {
    try {
        const rows = await dbAll('SELECT nome, cap, belfiore FROM cities WHERE prov = ? ORDER BY nome', [req.query.prov]);
        res.json(rows);
    } catch (err) { res.status(500).json([]); }
});

// --- API ADMIN & SIGNALS ---
app.post('/api/admin-login', (req, res) => {
    const { user, pass } = req.body;
    if (user === "admin" && pass === "MentalGod2026") {
        res.json({ success: true, token: "SQLITE_ADMIN_TOKEN" });
    } else {
        res.status(401).json({ success: false });
    }
});

app.get('/api/signals', async (req, res) => {
    const rows = await dbAll('SELECT * FROM signals ORDER BY id DESC');
    res.json(rows);
});

app.post('/api/signals', async (req, res) => {
    const { sport, competition, match, strategy, odds, label, link } = req.body;
    await dbRun(`INSERT INTO signals (sport, competition, match_name, strategy, odds, label, link) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [sport, competition, match, strategy, odds, label, link]);
    res.status(201).json({ message: "OK" });
});

app.delete('/api/signals/:id', async (req, res) => {
    await dbRun('DELETE FROM signals WHERE id = ?', [req.params.id]);
    res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
    console.log(`
🚀 Server SQLite attivo su: http://localhost:${PORT}`);
});
