const http = require("http");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

// Use environment PORT or fallback to 3000
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
// On Render, DATABASE_URL is automatically provided when you link a PostgreSQL database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database table
async function initDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Database table initialized");
    } catch (err) {
        console.error("Error initializing database:", err);
    }
}

initDatabase();

function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end("Server error");
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content);
        }
    });
}

const server = http.createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/") {
        serveFile(res, path.join(__dirname, "public", "index.html"), "text/html");
    } 
    else if (req.method === "GET" && req.url === "/users") {
        try {
            const result = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ users: result.rows }));
        } catch (err) {
            console.error("Error fetching users:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Database error" }));
        }
    } 
    else if (req.method === "POST" && req.url === "/users") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", async () => {
            try {
                const data = JSON.parse(body);
                const result = await pool.query(
                    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
                    [data.name, data.email]
                );
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(result.rows[0]));
            } catch (err) {
                console.error("Error inserting user:", err);
                res.writeHead(400, { "Content-Type": "application/json" });
                if (err.code === '23505') { // Unique constraint violation
                    res.end(JSON.stringify({ error: "Email already exists" }));
                } else {
                    res.end(JSON.stringify({ error: err.message }));
                }
            }
        });
    } 
    else {
        res.writeHead(404);
        res.end("Not found");
    }
});

// Bind to 0.0.0.0 (required for Render)
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        pool.end(() => {
            console.log('Database pool closed');
            process.exit(0);
        });
    });
});