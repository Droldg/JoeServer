const express = require('express');
const mssql = require('mssql');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
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

// Brug ruter
const userRoutes = require('./Routes/userRoute');
app.use('/api', userRoutes);

// Start HTTP-serveren
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server kører på http://localhost:${PORT}`);
});
