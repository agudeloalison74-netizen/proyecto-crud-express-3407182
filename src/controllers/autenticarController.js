const iniciarSesion = async (req, res)=> {
  //simular bd de un usuario registrado
  const userBd = {"usuario": "Dayana", "clave":"123"}
  try {
    const {usuario, clave} = req.body
    //comparar con userBD
    if(userBd.usuario !== usuario || userBd.clave !== clave){
      res.json({mensaje: "Credenciales incorrectas"})
    }
    res.json({mensaje: "Usuario Bienvenido"})
  }catch (error) {
    res.json({errorrror: error})
  }
}

const registrarse = async (req, res)=>{
  try {
      const datos = req.body
      res.json({datosRegistro: datos})
  } catch (error) {
      res.json({error: error})

  }
}

//se realiza todas las rutas
module.exports = {iniciarSesion, registrarse}