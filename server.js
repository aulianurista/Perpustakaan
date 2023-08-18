const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")                   

const app = express()  
app.use(cors())                                    
app.use(bodyParser.json())                          
app.use(bodyParser.urlencoded({extended: true}))

const siswa = require("./router/siswa")
app.use("/siswa", siswa)

const buku = require("./router/buku")
app.use("/buku", buku)

const petugas = require("./router/petugas")
app.use("/petugas", petugas)

const peminjaman = require("./router/peminjaman")
app.use( peminjaman)

app.listen(8000, () => {
    console.log("Server run on port 8000")
})