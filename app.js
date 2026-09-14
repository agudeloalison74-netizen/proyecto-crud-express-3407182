const { error } = require('console');
const express = require('express');
const app = express();

const port = process.env.MIPUERTO || 3003; 
//importar mis middleware
const registroMiddleware = require("./middleware/registroMiddleware")
const manejadorErrores = require("./middleware/manejadorErroresMiddleware")


// CORREGIDO: Se cambia 'extends' por 'extended' y se coloca junto al middleware json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//usar nuestros middleware
app.use(registroMiddleware)

// Librerías fs, path
const sistemaArchivo = require("fs");
const ruta = require("path");
const rutaMiArchivo = ruta.join(__dirname, "datos.json");

// Importar multer
const multer = require("multer");

// Importar validaciones
const { validarNombre, validarCorreo, validarId } = require("./validaciones/validaciones");

// Almacenamiento
const almacen = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "misimagenes/");
  },
  filename: (req, file, cb) => {
    const extension = ruta.extname(file.originalname);
    cb(null, `${Date.now()}${extension}`);
  }
});
const subir = multer({ storage: almacen });

app.get('/', (req, res) => {
  res.send('API Rest Full con express');
});

// READ - obtener todos los aprendices
app.get('/api/aprendices', (req, res) => {
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, datos) => {
    if (error) return res.status(500).json({ Error: "No se puede leer el archivo" });
    const listaAprendices = JSON.parse(datos);
    res.status(200).json({ Listado: listaAprendices });
  });
});

// READ - obtener un aprendiz por id
app.get('/api/aprendices/:id', (req, res) => {
  const { id } = req.params;
  
  // Validar formato del ID
  const validacion = validarId(id);
  if (!validacion.valido) {
    return res.status(400).json({ error: validacion.mensaje });
  }

  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, Datos) => {
    if (error) return res.status(500).json({ error: "No se puede leer el archivo" });
    const listaAprendices = JSON.parse(Datos);
    const aprendiz = listaAprendices.find(a => Number(a.id) === validacion.idNumero);
    if (!aprendiz) return res.status(404).json({ error: "Aprendiz no encontrado" });
    res.status(200).json(aprendiz);
  });
});

// CREATE - crear aprendiz con ID automático
app.post('/api/aprendices', subir.single("imagen"), (req, res) => {
  const datosAprendiz = req.body || {};

  // Validaciones de entrada
  const resultadoNombre = validarNombre(datosAprendiz.nombre);
  if (!resultadoNombre.valido) {
    return res.status(400).json({ Error: resultadoNombre.mensaje });
  }

  const resultadoCorreo = validarCorreo(datosAprendiz.correo);
  if (!resultadoCorreo.valido) {
    return res.status(400).json({ Error: resultadoCorreo.mensaje });
  }

  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, datos) => {
    if (error) return res.status(500).json({ Error: "No se puede leer el archivo" });
    
    // Si el archivo está vacío o da error al parsear, se usa un arreglo vacío
    let listaAprendices = [];
    try {
      listaAprendices = JSON.parse(datos);
    } catch (e) {
      listaAprendices = [];
    }

    // Filtrar para encontrar los aprendices válidos que tengan ID
    const aprendicesValidos = listaAprendices.filter(item => item && item.id !== undefined);

    // Obtener el último ID existente o 0 si no hay ninguno válido
    const ultimoId = aprendicesValidos.length > 0 
      ? Number(aprendicesValidos[aprendicesValidos.length - 1].id) 
      : 0;

    // Crear el nuevo objeto
    const nuevoAprendiz = {
      id: ultimoId + 1,
      ...datosAprendiz,
      imagen: req.file ? `/misimagenes/${req.file.filename}` : "sin_imagen"
    };

    listaAprendices.push(nuevoAprendiz);
    
    sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2), (error) => {
      if (error) return res.status(500).json({ Error: "No se puede escribir en el archivo" });
      res.status(200).json({ Mensaje: "creado", Datos: nuevoAprendiz });
    });
  });
});

app.put('/api/aprendices/:id', (req, res) => {
  res.status(200).json({ mensaje: "Actualizar aprendiz " });
});

app.delete('/api/aprendices', (req, res) => {
  res.status(200).json({ mensaje: "Eliminado " });
});

//provocando error
app.get("/api/error", (req, res, next)=>{
  next(new Error("Este es un error provocado"))
})
app.use(manejadorErrores)

app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto: http://localhost:${port}`);
});