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
        // origin: ['https://hait-joe.live/'], // Tillad kun din produktions-URL
        credentials: true, // Sørger for, at cookies sendes og modtages
    })
);

app.use(express.json({ limit: '10mb' })); // Tillader op til 10 MB JSON
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Tillader op til 10 MB form-data

app.use(cookieParser());

// Separate ruter for hver undermappe
app.use('/CSS', express.static(path.join(__dirname, 'Public', 'CSS')));
app.use('/JS', express.static(path.join(__dirname, 'Public', 'JS')));
app.use('/PNG', express.static(path.join(__dirname, 'Public', 'PNG')));
// Server HTML direkte fra "Public/HTML" uden /HTML i URL'en
app.use(express.static(path.join(__dirname, 'Public', 'HTML')));


// Server forsiden (index.html) fra "Public/HTML"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'HTML', 'index.html'));
});

// Brug ruter
const userRoutes = require('./Routes/userRoute');
app.use('/api', userRoutes);

const socialRoutes = require('./Routes/socialRoute');
app.use('/api', socialRoutes);


// Fejl-håndtering for 404 (siden ikke fundet)
app.use((req, res, next) => {
    res.status(404).send('Siden blev ikke fundet.');
});

// Generel fejlhåndtering
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Noget gik galt på serveren.');
});


// Start HTTP-serveren
const PORT = process.env.PORT || 3000; // Dynamisk port eller 3000 som fallback
app.listen(PORT, () => {
    console.log(`Server kører på http://localhost:${PORT}`);
});

//1234