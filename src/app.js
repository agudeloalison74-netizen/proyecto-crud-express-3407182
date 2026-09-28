require("dotenv").config();
const express = require("express");
const enrutadorGeneral = require("./routes");

const app = express();

//importar los middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//usamo los enrutadores de la carpeta router
app.use("/api", enrutadorGeneral)

//endpoint de la ruta raiz, de bienvenida a la api
app.get("/", (req, res)=>{
    res.send("API Rest 3407182 en funcionamiento");
});

module.exports = app;