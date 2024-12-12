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
            .query('SELECT UserID, Name, Email FROM dbo.UserTable WHERE UserID = @UserID;'); // Tilføj UserID til SELECT

        if (result.recordset.length === 0) {
            return res.status(404).send('User not found.');
        }

        const user = result.recordset[0];

        // Returnér UserID sammen med resten af data
        res.status(200).json({
            userID: user.UserID,
            name: user.Name,
            email: user.Email,
        });
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

router.post('/upload-profile-picture', sessionValidator, async (req, res) => {
    const { profilePicture } = req.body;
    const userId = req.user.id;

    if (!profilePicture) {
        return res.status(400).send('No profile picture provided.');
    }

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('UserID', mssql.Int, userId)
            .input('ProfilePicture', mssql.NVarChar(mssql.MAX), profilePicture)
            .query('UPDATE dbo.UserTable SET ProfilePicture = @ProfilePicture WHERE UserID = @UserID;');
        
        res.status(200).send('Profile picture updated successfully.');
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).send('An error occurred while updating profile picture.');
    }
});


module.exports = router;
