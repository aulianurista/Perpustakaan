// inisiasi library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const md5 = require("md5")

// implementation
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


//create MySQL Connection
const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "perpustakaan"
})

db.connect(error => {
    if (error) {
        console.log(error.message)
    } else {
        console.log("MySQL Connected")
    }
})


app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from peminjaman" 

    // run query
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }            
        } else {
            response = {
                count: result.length, // jumlah data
                peminjaman: result // isi data
            }            
        }
        res.json(response) // send response
    })
})

app.get("/:id", (req, res) => {
    let data = {
        id_pinjam: req.params.id
    }
    // create sql query
    let sql = "select * from peminjaman where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }            
        } else {
            response = {
                count: result.length, // jumlah data
                peminjaman: result // isi data
            }            
        }
        res.json(response) // send response
    })
})

// end-point menyimpan data peminjaman
app.post("/", (req,res) => {

    // prepare data
    let data = {
        id_siswa: req.body.id_siswa,
        tanggal_pinjam: req.body.tanggal_pinjam 
    }

    // create sql query insert
    let sql = "insert into peminjaman set ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response) // send response
    })
})

// end-point mengubah data peminjaman
app.put("/", (req,res) => {

    // prepare data
    let data = [
        // data
        {
            id_siswa: req.body.id_siswa,
            tanggal_pinjam: req.body.tanggal_pinjam 
        },

        // parameter (primary key)
        {
            id_peminjaman: req.body.id_peminjaman
        }
    ]

    // create sql query update
    let sql = "update peminjaman set ? where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response) // send response
    })
})

// end-point menghapus data peminjaman berdasarkan id_peminjaman
app.delete("/:id", (req,res) => {
    // prepare data
    let data = {
        id_peminjaman: req.params.id
    }

    // create query sql delete
    let sql = "delete from peminjaman where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response) // send response
    })
})

module.exports = app
