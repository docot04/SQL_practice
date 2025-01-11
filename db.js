//
require('dotenv').config();

// create SQL connection
const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});

// Utility function for executing queries
const executeQuery = (query, data, callback) => {
    try {
        connection.query(query, data, (err, result) => {
            if (err) return callback(err, null); // Pass error to the callback
            callback(null, result); // Pass result to the callback
        });
    } catch (err) {
        callback(err, null);
    }
};

module.exports = {executeQuery, connection};