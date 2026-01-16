const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// ESEMPIO DI DATASET ESTESO (In produzione si usa un file JSON esterno da 2MB)
const CITIES_DATA = [
    { nome: 'ROMA', cap: '00100', prov: 'RM', belfiore: 'H501' },
    { nome: 'MILANO', cap: '20100', prov: 'MI', belfiore: 'F205' },
    { nome: 'NAPOLI', cap: '80100', prov: 'NA', belfiore: 'F839' },
    { nome: 'TORINO', cap: '10100', prov: 'TO', belfiore: 'L219' },
    { nome: 'NOCERA INFERIORE', cap: '84014', prov: 'SA', belfiore: 'F912' },
    { nome: 'NOCERA SUPERIORE', cap: '84015', prov: 'SA', belfiore: 'F913' },
    { nome: 'SALERNO', cap: '84100', prov: 'SA', belfiore: 'H703' },
    { nome: 'CAVA DE\' TIRRENI', cap: '84013', prov: 'SA', belfiore: 'C361' },
    { nome: 'SCAFATI', cap: '84018', prov: 'SA', belfiore: 'I483' },
    { nome: 'PAGANI', cap: '84016', prov: 'SA', belfiore: 'G230' },
    { nome: 'ANGRI', cap: '84012', prov: 'SA', belfiore: 'A294' },
    // ... e altri 7900 comuni che caricheremmo da file
];

async function setupCities() {
    console.log("🔄 Inizializzazione Tabella Comuni...");

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // 1. Crea Tabella
        await connection.query(`
            CREATE TABLE IF NOT EXISTS cities (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                cap VARCHAR(5) NOT NULL,
                prov VARCHAR(2) NOT NULL,
                belfiore VARCHAR(4) NOT NULL,
                INDEX (nome) -- Indice per ricerca veloce
            );
        `);
        console.log("✅ Tabella 'cities' pronta.");

        // 2. Svuota (per evitare duplicati in dev)
        await connection.query('TRUNCATE TABLE cities');

        // 3. Inserimento Massivo
        const query = 'INSERT INTO cities (nome, cap, prov, belfiore) VALUES ?';
        const values = CITIES_DATA.map(c => [c.nome, c.cap, c.prov, c.belfiore]);
        
        await connection.query(query, [values]);
        console.log(`✅ Inseriti ${values.length} comuni (Demo).`);

        await connection.end();

    } catch (error) {
        console.error("❌ Errore:", error);
    }
}

setupCities();
