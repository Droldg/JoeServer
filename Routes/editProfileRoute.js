const express = require('express');
const bcrypt = require('bcryptjs');
const { poolPromise } = require('../database');
const sessionValidator = require('../middleware/sessionValidator');
const mssql = require('mssql'); // Importer mssql
const router = express.Router();

// Hent brugeroplysninger
router.get('/', sessionValidator, async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('UserID', req.user.id)
            .query('SELECT UserID, Name, Email, ProfilePicture FROM dbo.UserTable WHERE UserID = @UserID;');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = result.recordset[0];
        res.status(200).json({
            userID: user.UserID,
            name: user.Name,
            email: user.Email,
            profilePicture: user.ProfilePicture || '', // Returnér profilbillede, hvis det findes
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'An error occurred while fetching user details.' });
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
                .input('UserID', req.user.id)
                .input('Name', name)
                .input('Email', email)
                .input('Password', hashedPassword)
                .query('UPDATE dbo.UserTable SET Name = @Name, Email = @Email, Password = @Password WHERE UserID = @UserID;');
        } else {
            await pool.request()
                .input('UserID', req.user.id)
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

// Upload profilbillede
router.post('/upload-profile-picture', sessionValidator, async (req, res) => {
    const { profilePicture } = req.body; // Base64 billede-data

    if (!profilePicture) {
        return res.status(400).send('No profile picture provided.');
    }

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('UserID', req.user.id)
            .input('ProfilePicture', mssql.NVarChar(mssql.MAX), profilePicture) // Brug NVarChar(MAX) til base64
            .query('UPDATE dbo.UserTable SET ProfilePicture = @ProfilePicture WHERE UserID = @UserID;');

        res.status(200).send('Profile picture updated successfully.');
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).send('An error occurred while updating profile picture.');
    }
});







module.exports = router;
