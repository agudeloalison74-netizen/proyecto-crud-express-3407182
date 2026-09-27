require("dotenv").config();
const express = require("express");
const path = require("path");

//debemos importar los enrutadores a la carpeta router
const enrutadorGeneral = require("../routes");

//importar nuestros middleware
const registroMiddleware = require("./middleware/registroMiddleware");
const manejadorErrores = require("./middleware/manejadorErroresMiddleware");

const app = express();

//importar los middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(registroMiddleware);

//servir las imágenes subidas de forma pública
app.use("/misimagenes", express.static(path.join(__dirname, "misimagenes")));

//usamos el enrutador general
app.use("/api", enrutadorGeneral)

//endpoint de la ruta raiz, de bienvenida a la API
app.get("/", (req,res)=>{
    res.send("API Rest 3407182 en funcionamiento");
})

//middleware de manejo de errores (siempre al final)
app.use(manejadorErrores);

module.exports = app;
