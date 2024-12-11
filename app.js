const express = require('express');
const mssql = require('mssql');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');
const app = express();
const config = require('./config');

// Læs certifikatfiler til HTTPS
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Forbind til databasen
const pool = new mssql.ConnectionPool(config);
const poolConnect = pool.connect();

// Middleware
app.use(morgan('dev'));

// CORS-konfiguration
app.use(
    cors({
        origin: true, // Tillader alle oprindelser under udvikling
        credentials: true, // Sørger for, at cookies sendes og modtages
    })
);



app.use(express.json());
app.use(cookieParser());

// Brug ruter
const userRoutes = require('./Routes/userRoute');
app.use('/api', userRoutes);

// Opret HTTPS-server
const httpsServer = https.createServer(credentials, app);

// Start serveren
httpsServer.listen(3000, () => {
    console.log('HTTPS-serveren kører på port 3000');
});
