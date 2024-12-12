const express = require('express');
const bcrypt = require('bcryptjs');
const { poolPromise } = require('../database');
const router = express.Router();

const sessions = {}; // Midlertidig sessionlagring fra userRoute (del evt. sessions herfra).

// Hent brugeroplysninger
router.get('/', async (req, res) => {
    const sessionId = req.cookies.auth_session;

    if (!sessionId || !sessions[sessionId]) {
        return res.status(401).send('Not authenticated.');
    }

    const userId = sessions[sessionId].user.id;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', mssql.Int, userId)
            .query('SELECT Name, Email FROM dbo.UserTable WHERE UserID = @UserID;');

        if (result.recordset.length === 0) {
            return res.status(404).send('User not found.');
        }

        res.status(200).send(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('An error occurred while fetching user details.');
    }
});

// Opdater brugeroplysninger
router.post('/', async (req, res) => {
    const sessionId = req.cookies.auth_session;

    if (!sessionId || !sessions[sessionId]) {
        return res.status(401).send('Not authenticated.');
    }

    const { name, email, password } = req.body;
    const userId = sessions[sessionId].user.id;

    try {
        const pool = await poolPromise;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.request()
                .input('UserID', mssql.Int, userId)
                .input('Name', mssql.NVarChar, name)
                .input('Email', mssql.NVarChar, email)
                .input('Password', mssql.NVarChar, hashedPassword)
                .query('UPDATE dbo.UserTable SET Name = @Name, Email = @Email, Password = @Password WHERE UserID = @UserID;');
        } else {
            await pool.request()
                .input('UserID', mssql.Int, userId)
                .input('Name', mssql.NVarChar, name)
                .input('Email', mssql.NVarChar, email)
                .query('UPDATE dbo.UserTable SET Name = @Name, Email = @Email WHERE UserID = @UserID;');
        }

        res.status(200).send('Profile updated successfully.');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('An error occurred during profile update.');
    }
});

module.exports = router;
