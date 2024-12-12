const express = require('express');
const mssql = require('mssql');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { poolPromise } = require('../database');
const sessions = require('../session'); // Importér det delte sessions-objekt
const sessionValidator = require('../middleware/sessionValidator'); // Import sessionValidator middleware

const router = express.Router();
const sessionTimeout = 3600000; // 1 time

// Endpoint til registrering af bruger
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const pool = await poolPromise;

        const existingUser = await pool.request()
            .input('Email', mssql.NVarChar, email)
            .query('SELECT COUNT(*) AS count FROM dbo.UserTable WHERE Email = @Email;');

        if (existingUser.recordset[0].count > 0) {
            return res.status(400).send('Email already registered.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.request()
            .input('Name', mssql.NVarChar, name)
            .input('Email', mssql.NVarChar, email)
            .input('Password', mssql.NVarChar, hashedPassword)
            .query('INSERT INTO dbo.UserTable (Name, Email, Password) VALUES (@Name, @Email, @Password);');

        res.status(201).send('User registered successfully.');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('An error occurred during signup.');
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const { email, password } = req.body;

    try {
        const pool = await poolPromise;

        const userResult = await pool.request()
            .input('Email', mssql.NVarChar, email)
            .query('SELECT * FROM dbo.UserTable WHERE Email = @Email;');

        if (userResult.recordset.length === 0) {
            return res.status(401).send('Invalid email or password.');
        }

        const user = userResult.recordset[0];
        const isPasswordValid = await bcrypt.compare(password, user.Password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid email or password.');
        }

        // Generer session-ID
        const sessionId = crypto.randomBytes(16).toString('hex');
        sessions[sessionId] = { user: { id: user.UserID, name: user.Name }, createdAt: Date.now() };

        // Sæt cookie
        res.cookie('auth_session', sessionId, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000, // 1 time
            sameSite: 'None', // Tillad cross-site
            path: '/',
        });

        console.log('Cookies in login:', req.cookies);
        console.log('Sessions in memory:', sessions);

        res.status(200).send({ message: 'Login successful', user: { name: user.Name } });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('An error occurred during login.');
    }
});

// Accept cookies endpoint
router.post('/accept-cookies', sessionValidator, (req, res) => {
    res.cookie('cookies_accepted', 'true', {
        httpOnly: false,
        secure: true,
        maxAge: 3600000,
        sameSite: 'None',
        path: '/',
    });

    res.status(200).send({ message: 'Cookies accepted successfully.' });
});

// Logout endpoint
router.post('/logout', sessionValidator, (req, res) => {
    const sessionId = req.cookies.auth_session;
    if (sessionId) {
        delete sessions[sessionId];
    }
    res.clearCookie('auth_session', { path: '/', secure: true, sameSite: 'Lax' });
    res.clearCookie('cookies_accepted', { path: '/', secure: true, sameSite: 'Lax' });
    res.status(200).send('Logged out successfully');
});

// Tjek brugerens session-status
router.get('/check-auth', sessionValidator, (req, res) => {
    res.status(200).send({ message: 'Authenticated', name: req.user.name });
});

module.exports = router;
