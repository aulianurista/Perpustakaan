const express = require("express")
const app = express()
const multer = require("multer") // untuk upload file
const path = require("path") // untuk memanggil path direktori
const fs = require("fs") // untuk manajemen file
const mysql = require("mysql")
const db = require("../config")
const cors = require("cors")

app.use(express.static(__dirname));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "image -"+ path.extname(file.originalname))
    }
})

let upload = multer({storage: storage})

// endpoint untuk menambah data siswa baru
app.post("/", upload.single("image"), (req, res) => {
    // prepare data`
    let data = {
       judul_buku: req.body.judul_buku,
       halaman_buku: req.body.halaman_buku,
       ket_kondisi_buku: req.body.ket_kondisi_buku,
       image: req.file.filename
    }

    if (!req.file) {
        // jika tidak ada file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        // create sql insert
        let sql = "insert into buku set ?"

        // run query
        db.query(sql, data, (error, result) => {
            if(error) throw error
            res.json({
                message: result.affectedRows + " data berhasil disimpan"
            })
        })
    }
})

// endpoint ambil data siswa
app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from buku"

    // run query
    db.query(sql, (error, result) => {
        if (error) throw error
        res.json({
            data: result,
            count: result.length
        })
    })
})

app.put("/:id_buku", upload.single("image"), (req,res) => {
    let data = null, sql = null
    // paramter perubahan data
    let param = { id_buku: req.params.id_buku}

    if (!req.file) {
        // jika tidak ada file yang dikirim = update data saja
        data = {
            judul_buku: req.body.judul_buku,
            halaman_buku: req.body.halaman_buku,
            ket_kondisi_buku: req.body.ket_kondisi_buku,
            image: req.file.filename
        }
    } else {
        // jika mengirim file = update data + reupload
        data = {
            judul_buku: req.body.judul_buku,
            halaman_buku: req.body.halaman_buku,
            ket_kondisi_buku: req.body.ket_kondisi_buku,
            image: req.file.filename
        }

        // get data yg akan diupdate utk mendapatkan nama file yang lama
        sql = "select * from buku where ?"
        // run query
        db.query(sql, param, (err, result) => {
            if (err) throw err
            // tampung nama file yang lama
            let fileName = result[0].image

            // hapus file yg lama
            let dir = path.join(__dirname,"image",fileName)
            fs.unlink(dir, (error) => {})
        })

    }

    // create sql update
    sql = "update buku set ? where ?"

    // run sql update
    db.query(sql, [data,param], (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil diubah"
            })
        }
    })
})

// endpoint untuk menghapus data siswa
app.delete("/:id_buku", (req,res) => {
    let param = {id_buku: req.params.id_buku}

    // ambil data yang akan dihapus
    let sql = "select * from buku where ?"
    // run query
    db.query(sql, param, (error, result) => {
        if (error) throw error
        
        // tampung nama file yang lama
        let image = result[0].image

        // hapus file yg lama
        let dir = path.join(__dirname,"image",image)
        fs.unlink(dir, (error) => {})
    })

    // create sql delete
    sql = "delete from buku where ?"

    // run query
    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + " data berhasil dihapus"
            })
        }      
    })
})

module.exports = app