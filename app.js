const express = require('express');
const mssql = require('mssql');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path'); // Importer path til at håndtere filstier

const app = express();
const config = require('./config');

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

// Server statiske filer fra mappen "Public"
app.use(express.static(path.join(__dirname, 'Public')));

// Server forsiden (index.html) fra "Public/HTML"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'HTML', 'index.html'));
});

// Brug ruter
const userRoutes = require('./Routes/userRoute');
app.use('/api', userRoutes);

// Start HTTP-serveren
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server kører på http://localhost:${PORT}`);
});
