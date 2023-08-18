/* File Connection to MySql */
const mysql = require("mysql")      // Import library from mysql

/* Initialitation Database */
const db = mysql.createConnection({ // Var db to connect database (mysql)
    host: "localhost", 
    user: "root",
    password: "",
    database: "perpustakaan" // nama database
})

/* Check Connection */
db.connect(error => {
    if (error) {                        // Jika connection error
        console.log(error.message)      // Tampilkan error
    } else {                            // Jika Connection berhasil
        console.log("MySQL Connected")  // Tampilkan MySQL Connected
    }
})

/* Export configuration database */
module.exports = db // Export file supaya dapat digunakan di file lain
