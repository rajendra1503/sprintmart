const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

// Node's built-in SQLite module - no native compilation, no build tools
// required on any student's machine. Requires Node 22.5+.

const DB_PATH = path.join(__dirname, 'sprintmart.sqlite');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

const db = new DatabaseSync(DB_PATH);

const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
db.exec(schema);

module.exports = { db };
