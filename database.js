// Proper way to initialize and share the Database object

// Loading and initializing the library:
const pgp = require('pg-promise')({
    // Initialization Options
});

// Creating a new database instance from the connection details:
const db = pgp(process.env.DB_CONN_STRING);

// Exporting the database object for shared use:
module.exports = db;
