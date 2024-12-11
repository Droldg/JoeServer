const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3001; // Port for webhook server
const WEBHOOK_SECRET = 'my_secret_key'; // Secret key for HMAC verification

// Middleware for raw body parsing
app.use(
    bodyParser.raw({ type: 'application/json' }) // Raw data for HMAC verification
);

function verifySignature(req, secret) {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        console.error('No signature provided.');
        return false;
    }

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(req.body); // Use raw body
    const expectedSignature = `sha256=${hmac.digest('hex')}`;

    console.log('Signature from GitHub:', signature);
    console.log('Computed Signature:', expectedSignature);

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

app.post('/webhook', (req, res) => {
    if (!verifySignature(req, WEBHOOK_SECRET)) {
        console.error('Invalid signature.');
        return res.status(401).send('Invalid signature.');
    }

    const payload = JSON.parse(req.body); // Parse raw body after verification
    if (payload.ref === 'refs/heads/main') {
        console.log('Push event received. Running git pull...');
        exec('git pull', { cwd: '/root/JoeServer' }, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error during git pull: ${stderr}`);
                return res.status(500).send(`Error: ${stderr}`);
            }
            console.log(`Git Pull Output: ${stdout}`);
            exec('pm2 restart joe-app', (pm2Err, pm2Stdout, pm2Stderr) => {
                if (pm2Err) {
                    console.error(`PM2 Restart Error: ${pm2Stderr}`);
                    return res.status(500).send(`PM2 Error: ${pm2Stderr}`);
                }
                console.log(`PM2 Restart Output: ${pm2Stdout}`);
                res.status(200).send('Git pull and PM2 restart executed successfully');
            });
        });
    } else {
        res.status(200).send('Not a push event on main branch. Ignored.');
    }
});

// Start Webhook-serveren
app.listen(PORT, () => {
    console.log(`Webhook server running on http://localhost:${PORT}`);
});
