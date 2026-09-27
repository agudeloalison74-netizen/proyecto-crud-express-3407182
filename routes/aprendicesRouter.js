const { Router } = require("express");
const multer = require("multer");
const path = require("path");

const {
  listarAprendices,
  obtenerAprendizPorId,
  crearAprendiz,
  actualizarAprendiz,
  eliminarAprendiz,
} = require("../src/controllers/aprendicesController");

const enrutadorAprendices = Router();

// Configuración de almacenamiento de imágenes (carpeta src/misimagenes)
const almacen = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "src", "misimagenes"));
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${Date.now()}${extension}`);
  },
});
const subir = multer({ storage: almacen });

enrutadorAprendices.get("/", listarAprendices);
enrutadorAprendices.get("/:id", obtenerAprendizPorId);
enrutadorAprendices.post("/", subir.single("imagen"), crearAprendiz);
enrutadorAprendices.put("/:id", subir.single("imagen"), actualizarAprendiz);
enrutadorAprendices.delete("/:id", eliminarAprendiz);

module.exports = enrutadorAprendices;
