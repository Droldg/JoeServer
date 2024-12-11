const express = require('express');
const mssql = require('mssql');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path'); // Til håndtering af stier
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

// Server statiske filer (f.eks. HTML, CSS, JS) fra "Public"-mappen
app.use(express.static(path.join(__dirname, 'Public')));

// Rute til forsiden (hvis der er en "index.html" i "Public")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// Brug ruter
const userRoutes = require('./Routes/userRoute');
app.use('/api', userRoutes);

// Start HTTP-serveren
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server kører på http://localhost:${PORT}`);
});
