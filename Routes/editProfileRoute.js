const express = require('express');
const bcrypt = require('bcryptjs');
const { poolPromise } = require('../database');
const sessionValidator = require('../middleware/sessionValidator');
const router = express.Router();

// Hent brugeroplysninger
router.get('/', sessionValidator, async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('UserID', req.user.id) // Brug middleware-indsat bruger-ID
            .query('SELECT Name, Email FROM dbo.UserTable WHERE UserID = @UserID;');

        if (result.recordset.length === 0) {
            return res.status(404).send('User not found.');
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('An error occurred while fetching user details.');
    }
});

// Opdater brugeroplysninger
router.post('/', sessionValidator, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const pool = await poolPromise;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.request()
                .input('UserID', req.user.id) // Brug middleware-indsat bruger-ID
                .input('Name', name)
                .input('Email', email)
                .input('Password', hashedPassword)
                .query('UPDATE dbo.UserTable SET Name = @Name, Email = @Email, Password = @Password WHERE UserID = @UserID;');
        } else {
            await pool.request()
                .input('UserID', req.user.id) // Brug middleware-indsat bruger-ID
                .input('Name', name)
                .input('Email', email)
                .query('UPDATE dbo.UserTable SET Name = @Name, Email = @Email WHERE UserID = @UserID;');
        }

        res.status(200).send('Profile updated successfully.');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('An error occurred during profile update.');
    }
});

module.exports = router;
