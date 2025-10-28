const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path'); // Import the path module

const app = express();
const port = 3000;
const saltRounds = 10; // For password hashing

app.use(cors()); // Allow requests from frontend
app.use(express.json({ limit: '50mb' })); // Increase payload limit to 50MB for larger images

// --- Database Setup ---
// This creates a 'database.db' file in your project folder if it doesn’t exist
const dbPath = path.resolve(__dirname, 'database.db'); // Create an absolute path to the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
    } else {
        console.log('✅ Connected to the SQLite database.');
        // Create users table if it doesn’t exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`);
        // Create products table if it doesn’t exist
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            category TEXT NOT NULL,
            image TEXT NOT NULL
        )`);
    }
});

// --- API ROUTES ---

/**
 * @route   POST /api/signup
 * @desc    Register a new user
 */
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        db.run(sql, [name, email, hashedPassword], function (err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(409).json({ message: 'An account with this email already exists.' });
                }
                return res.status(500).json({ message: 'Database error during sign up.', error: err.message });
            }
            res.status(201).json({ message: 'Signup successful! You can now sign in.', userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during password hashing.' });
    }
});

/**
 * @route   POST /api/signin
 * @desc    Sign in a user
 */
app.post('/api/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error during sign in.' });
        }
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials. Please try again.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.status(200).json({
                message: `Welcome, ${user.name}!`,
                user: { name: user.name, email: user.email }
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials. Please try again.' });
        }
    });
});

// --- PRODUCT API ROUTES ---

/**
 * @route   GET /api/products
 * @desc    Get all products
 */
app.get('/api/products', (req, res) => {
    const sql = `SELECT * FROM products ORDER BY id DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error fetching products.', error: err.message });
        }
        res.status(200).json(rows);
    });
});

/**
 * @route   POST /api/products
 * @desc    Add a new product
 */
app.post('/api/products', (req, res) => {
    const { name, price, category, image } = req.body;

    if (!name || !price || !category || !image) {
        return res.status(400).json({ message: 'Please provide all product details.' });
    }

    const sql = `INSERT INTO products (name, price, category, image) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, price, category, image], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error adding product.', error: err.message });
        }
        res.status(201).json({ message: 'Product added successfully!', productId: this.lastID });
    });
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 */
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM products WHERE id = ?`;

    db.run(sql, id, function(err) {
        if (err) {
            return res.status(500).json({ message: 'Database error deleting product.', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({ message: 'Product deleted successfully.' });
    });
});

// --- Start the Server ---
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
