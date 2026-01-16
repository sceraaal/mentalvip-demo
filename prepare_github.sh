#!/bin/bash

# 1. Pulisci file non necessari per la demo statica
rm -f server.js db_setup.js setup_sqlite.js import_real_cities.js mentalvip.db package-lock.json
rm -rf node_modules uploads .env

# 2. Crea .gitignore
echo "node_modules" > .gitignore
echo ".DS_Store" >> .gitignore
echo ".env" >> .gitignore

# 3. Inizializza Git
git init
git add .
git commit -m "Initial Static Demo Commit"

echo "✅ PROGETTO PRONTO PER GITHUB/VERCEL!"
echo "Ora puoi eseguire: git remote add origin <TUO_REPO_URL> && git push -u origin main"