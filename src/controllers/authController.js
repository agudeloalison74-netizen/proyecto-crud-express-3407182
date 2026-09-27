const jwtoken = require("jsonwebtoken");

// Simula una base de datos de usuarios (mientras no haya una real)
const bdUsuario = { usuario: "Alison", clave: "1234" };

// POST /api/iniciarSesion - valida credenciales y genera un token
function iniciarSesion(req, res) {
  const { usuario, clave } = req.body || {};

  if (usuario !== bdUsuario.usuario || clave !== bdUsuario.clave) {
    return res.status(401).json({ mensaje: "Usuario y/o clave incorrecta!!" });
  }

  const token = jwtoken.sign(
    { usuario },
    process.env.JWT_SECRETO,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token });
}

module.exports = {
  iniciarSesion,
};
