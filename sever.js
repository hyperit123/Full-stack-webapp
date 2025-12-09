

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SESSION_SECRET || 'your-secret', resave: false, saveUninitialized: true }));

// Set up SQLite database
const db = new sqlite3.Database('./users.db');
db.run(`CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    data TEXT
)`);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Index.html'));
});
app.get('/charactersheet', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'charactersheet.html'));
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (row && row.password === password) {
            req.session.username = username;
            res.json({ success: true });
        } else if (!row) {
            // Register new user
            db.run('INSERT INTO users (username, password, data) VALUES (?, ?, ?)', [username, password, '{}'], (err) => {
                req.session.username = username;
                res.json({ success: true });
            });
        } else {
            res.json({ success: false });
        }
    });
});

// Save user data
app.post('/save', (req, res) => {
    if (!req.session.username) return res.status(401).end();
    // Always save the full JSON payload, including pfpDataUrl
    let data = req.body.data;
    // Defensive: ensure pfpDataUrl is present if sent
    if (data && typeof data === 'object' && data.pfpDataUrl) {
        // nothing to do, just keep as is
    }
    const dataStr = JSON.stringify(data);
    db.run('UPDATE users SET data = ? WHERE username = ?', [dataStr, req.session.username], (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true });
    });
});

// Load user data
app.get('/data', (req, res) => {
    if (!req.session.username) return res.status(401).end();
    db.get('SELECT data FROM users WHERE username = ?', [req.session.username], (err, row) => {
        if (row && row.data) {
            let parsed;
            try {
                parsed = JSON.parse(row.data);
            } catch (e) {
                parsed = {};
            }
            // Defensive: always send pfpDataUrl if present
            res.json({ data: parsed });
        } else {
            res.json({ data: {} });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});