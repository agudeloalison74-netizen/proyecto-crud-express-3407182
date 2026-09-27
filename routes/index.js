//consolida o agrupa todos los enrutadores
const {Router} = require ("express")
const enrutadorGeneral = Router()
const enrutadorPrueba = require("./pruebaRouter");
const enrutadorAprendices = require("./aprendicesRouter");
const enrutadorAuth = require("./authRouter");

enrutadorGeneral.use("/rutaprueba", enrutadorPrueba)
enrutadorGeneral.use("/aprendices", enrutadorAprendices)
enrutadorGeneral.use("/", enrutadorAuth)

module.exports = enrutadorGeneral;

