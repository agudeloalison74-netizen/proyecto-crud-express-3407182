const { error } = require('console');
const express = require ('express');
const app = express();
app.use(express.urlencoded({extends : true}));
const port = process.env.MIPUERTO || 3003; 

//librerias fs, path
const sistemaArchivo = require("fs");
const ruta = require("path");
const rutaMiArchivo = ruta.join(__dirname, "datos.json");

//importar multer
const multer = require ("multer");

//importar validaciones
const { validarNombre, validarCorreo, validarId } = require("./validaciones/validaciones");

//almacenamiento
const almacen = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,"misimagenes/")},
  filename : (req,file,cb)=>{
    const extension = ruta.extname(file.originalname)
    cb(null,`${Date.now()}${extension}`)}
})
const subir = multer({storage: almacen})

//middle warc body_parse
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API Rest Full con express');
});

app.get('/api/aprendices', (req, res) => {
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, datos)=>{
    if(error) res.status(500).json({Error: "No se puede leer el archivo"})
      const listaAprendices = JSON.parse (datos)
      res.status(200).json({Listado: listaAprendices})
  })
// res.status(200).json({mensaje: "Lista aprendices "})
});

app.post('/api/aprendices', subir.single("imagen") ,(req, res) => {
  const datosAprendiz = req.body

  const resultadoNombre = validarNombre(datosAprendiz.nombre)
  if (!resultadoNombre.valido) {
    return res.status(400).json({ Error: resultadoNombre.mensaje })
  }

  const resultadoCorreo = validarCorreo(datosAprendiz.correo)
  if (!resultadoCorreo.valido) {
    return res.status(400).json({ Error: resultadoCorreo.mensaje })
  }

  datosAprendiz.imagen = req.file? `/misimagenes/${req.file.fieldname}` : "sin_imagen"
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, datos)=>{
    if(error) res.status(500).json({Error: "No se puede leer el archivo"})
      const listaAprendices = JSON.parse (datos)
      listaAprendices.push(datosAprendiz)
      sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2), (error)=>{
        if(error) res.status(500).json({Error: "No se puede escribir en el archivo"})
        res.status(200).json({Mensaje: "creado", Datos: datosAprendiz})
      })
  })
});

app.put('/api/aprendices/:id', (req, res) => {
res.status(200).json({mensaje: "Actualizar aprendiz "})
});

app.delete('/api/aprendices', (req, res) => {
res.status(200).json({mensaje: "Eliminado "})
});



app.listen(port, () => {
 console.log( `Servidor en funcionamiento en el puerto: http://localhost:${port}`);
});