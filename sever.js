const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Pool, Client } = require('pg');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SESSION_SECRET || 'your-secret', resave: false, saveUninitialized: true }));

// Database configuration
const DB_USER = process.env.POSTGRES_USER || 'postgres';
const DB_PASS = process.env.POSTGRES_PASSWORD || 'postgres';
const DB_HOST = process.env.POSTGRES_HOST || 'localhost';
const DB_NAME = process.env.POSTGRES_DB || 'fullstackdb';
const DB_PORT = Number(process.env.POSTGRES_PORT || 5432);

let pool;

async function ensureDatabaseExists() {
    // Wait for Postgres to be reachable
    let connected = false;
    for (let i = 0; i < 60 && !connected; i++) {
        const adminClient = new Client({
            user: DB_USER,
            host: DB_HOST,
            database: 'postgres',
            password: DB_PASS,
            port: DB_PORT,
        });
        try {
            await adminClient.connect();
            // ensure DB exists
            const result = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]);
            if (result.rowCount === 0) {
                await adminClient.query(`CREATE DATABASE "${DB_NAME}"`);
                console.log(`Created database ${DB_NAME}`);
            }
            connected = true;
        } catch (e) {
            await new Promise(r => setTimeout(r, 1000));
        } finally {
            try { await adminClient.end(); } catch {}
        }
    }
    if (!connected) throw new Error('Postgres not reachable');
}

async function initDb() {
    await ensureDatabaseExists();
    pool = new Pool({
        user: DB_USER,
        host: DB_HOST,
        database: DB_NAME,
        password: DB_PASS,
        port: DB_PORT,
    });
    // Create users table if it doesn't exist
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL,
            data JSON
        );
    `);
    console.log('Users table is ready.');
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Index.html'));
});
app.get('/charactersheet', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'charactersheet.html'));
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    pool.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false });
        }
        const row = result.rows[0];
        if (row) {
            const stored = row.password || '';
            const isHashed = typeof stored === 'string' && stored.startsWith('$2');
            if (isHashed) {
                const ok = bcrypt.compareSync(password, stored);
                if (!ok) return res.json({ success: false });
                req.session.username = username;
                return res.json({ success: true });
            } else {
                if (stored === password) {
                    // Upgrade to hashed password
                    try {
                        const hashed = bcrypt.hashSync(password, 10);
                        pool.query('UPDATE users SET password = $1 WHERE username = $2', [hashed, username], () => {});
                    } catch {}
                    req.session.username = username;
                    return res.json({ success: true });
                }
                return res.json({ success: false });
            }
        } else {
            // Register new user with hashed password
            try {
                const hashed = bcrypt.hashSync(password, 10);
                pool.query('INSERT INTO users (username, password, data) VALUES ($1, $2, $3)', [username, hashed, '{}'], (err) => {
                    if (err) {
                        return res.status(500).json({ success: false });
                    }
                    req.session.username = username;
                    res.json({ success: true });
                });
            } catch (e) {
                return res.status(500).json({ success: false });
            }
        }
    });
});

// Save user data
app.post('/save', (req, res) => {
    if (!req.session.username) return res.status(401).end();
    const dataStr = JSON.stringify(req.body.data);
    pool.query('UPDATE users SET data = $1 WHERE username = $2', [dataStr, req.session.username], (err) => {
        if (err) return res.json({ success: false });
        res.json({ success: true });
    });
});

// Load user data
app.get('/data', (req, res) => {
    if (!req.session.username) return res.status(401).end();
    pool.query('SELECT data FROM users WHERE username = $1', [req.session.username], (err, result) => {
        if (err || result.rows.length === 0) {
            return res.json({ data: {} });
        }
        const row = result.rows[0];
        let parsed;
        try {
            parsed = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {});
        } catch (e) {
            parsed = {};
        }
        res.json({ data: parsed });
    });
});

// Add a route to check who is logged in
app.get('/whoami', (req, res) => {
    if (req.session.username) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).json({ username: null });
    }
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});

// Change password route
app.post('/change-password', (req, res) => {
    if (!req.session.username) return res.status(401).end();

    const { password } = req.body;
    if (!password || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    let hashed;
    try {
        hashed = bcrypt.hashSync(password, 10);
    } catch (e) {
        return res.status(500).json({ success: false });
    }
    pool.query('UPDATE users SET password = $1 WHERE username = $2', [hashed, req.session.username], (err) => {
        if (err) {
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});

(async () => {
    try {
        await initDb();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.error('Failed to initialize database:', e);
        process.exit(1);
    }
})();