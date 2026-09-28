const {Router} = require("express")

const enrutadorAutch = Router();
//impotacion del controlador
const {iniciarSesion, registrarse} = require("../controllers/autenticarController")
//const registrarse = require("../controllers/autenticarController")

//Ruta de registro en el sistema
enrutadorAutch.post("/registro", registrarse)

//ruta de inicio de sesion
enrutadorAutch.post("/login", iniciarSesion)

//se realiza todas las rutas, con (POST, PUT, DELETE)
module.exports = enrutadorAutch;
