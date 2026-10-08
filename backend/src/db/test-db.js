import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSqliteDb } from './sqlite.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Definiamo il percorso dove creare il file fisicamente .sqlite
const dbPath = path.resolve(__dirname, '../../src/db/database.sqlite');

// Invochiamo la funzione
const db = createSqliteDb(dbPath);

// Facciamo una query di prova per verificare che la tabella services esista
const result = await db.query("SELECT count(*) AS total FROM services");
console.log("Servizi trovati nel DB:", result.rows);

await db.close();