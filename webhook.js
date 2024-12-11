const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3001; // Port for webhook server

// GitHub Webhook Secret Key
const WEBHOOK_SECRET = 'my_secret_key';

// Middleware til parsing af JSON
app.use(bodyParser.json());

// Verificer signatur fra GitHub
function verifySignature(req, secret) {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        console.error('No signature provided.');
        return false;
    }

    const hmac = crypto.createHmac('sha256', secret);
    const payload = JSON.stringify(req.body); // Konverter objekt til JSON-streng
    hmac.update(payload); // Brug korrekt dataformat

    const expectedSignature = `sha256=${hmac.digest('hex')}`;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

// Middleware til signatur-verificering
app.use((req, res, next) => {
    const rawBody = JSON.stringify(req.body);
    const valid = verifySignature({ headers: req.headers, body: rawBody }, WEBHOOK_SECRET);
    if (!valid) {
        console.error('Invalid signature.');
        return res.status(401).send('Invalid signature.');
    }
    next();
});

// Webhook-endpoint
app.post('/webhook', (req, res) => {
    const payload = req.body;

    // Tjek, om det er et push-event på 'main'-branch
    if (payload.ref === 'refs/heads/main') {
        console.log('Push event received. Running git pull...');

        // Kør git pull
        exec('git pull', { cwd: '/root/JoeServer' }, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error during git pull: ${stderr}`);
                return res.status(500).send(`Error: ${stderr}`);
            }
            console.log(`Git Pull Output: ${stdout}`);

            // Genstart PM2-processen efter pull
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
