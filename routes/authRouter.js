const { Router } = require("express");
const { iniciarSesion } = require("../src/controllers/authController");

const enrutadorAuth = Router();

enrutadorAuth.post("/iniciarSesion", iniciarSesion);

module.exports = enrutadorAuth;
