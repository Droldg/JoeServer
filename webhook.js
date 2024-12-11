const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001; // Port for webhook server

// GitHub Webhook Secret (den du har angivet i GitHub)
const WEBHOOK_SECRET = 'your_secret_key';

// Middleware til parsing af JSON
app.use(bodyParser.json());

// Verificér Webhook-signatur
const crypto = require('crypto');
function verifySignature(req, res, buf) {
    const signature = `sha256=${crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(buf)
        .digest('hex')}`;

    if (req.headers['x-hub-signature-256'] !== signature) {
        res.status(401).send('Invalid signature');
        return false;
    }
    return true;
}

// Middleware til signatur-verificering
app.use((req, res, next) => {
    bodyParser.raw({ type: 'application/json' })(req, res, (err) => {
        if (err || !verifySignature(req, res, req.body)) return;
        next();
    });
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
                res.status(500).send(`Error: ${stderr}`);
                return;
            }
            console.log(`Git Pull Output: ${stdout}`);
            res.status(200).send('Git pull executed successfully');
        });
    } else {
        res.status(200).send('Not a push event on main branch. Ignored.');
    }
});

// Start Webhook-serveren
app.listen(PORT, () => {
    console.log(`Webhook server running on http://localhost:${PORT}`);
});
