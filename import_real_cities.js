const fs = require('fs');
const readline = require('readline');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const FILE_PATH = '/Users/simonasceral/Downloads/listacomuni.txt';

async function importCities() {
    console.log("🚀 Avvio Importazione Massiva Comuni...");

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // 1. Pulisci Tabella Esistente
        await connection.query('TRUNCATE TABLE cities');
        console.log("🧹 Tabella 'cities' svuotata.");

        // 2. Leggi File
        const fileStream = fs.createReadStream(FILE_PATH);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let citiesBatch = [];
        let count = 0;
        let isHeader = true;

        for await (const line of rl) {
            if (isHeader) {
                isHeader = false;
                continue; // Salta intestazione
            }

            const cols = line.split(';');
            if (cols.length < 7) continue;

            const nome = cols[1].toUpperCase(); // Comune
            const prov = cols[2];               // Provincia
            const cap = cols[5];                // CAP
            const belfiore = cols[6];           // CodFisco

            citiesBatch.push([nome, cap, prov, belfiore]);
            count++;

            // Inserisci ogni 500 righe per efficienza
            if (citiesBatch.length >= 500) {
                await connection.query('INSERT INTO cities (nome, cap, prov, belfiore) VALUES ?', [citiesBatch]);
                citiesBatch = [];
                process.stdout.write(`\r📥 Caricati: ${count} comuni...`);
            }
        }

        // Inserisci ultimi rimasti
        if (citiesBatch.length > 0) {
            await connection.query('INSERT INTO cities (nome, cap, prov, belfiore) VALUES ?', [citiesBatch]);
        }

        console.log(`\n✅ COMPLETATO! Totale Comuni: ${count}`);
        
    } catch (error) {
        console.error("\n❌ ERRORE:", error);
    } finally {
        if (connection) await connection.end();
    }
}

importCities();
