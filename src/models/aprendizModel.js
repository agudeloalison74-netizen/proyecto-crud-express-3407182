const fs = require("fs/promises");
const path = require("path");

// El archivo datos.json vive en la raíz del proyecto
const rutaArchivo = path.join(__dirname, "..", "..", "datos.json");

// Lee el archivo y devuelve el arreglo de aprendices (si algo falla, devuelve [])
async function leerAprendices() {
  try {
    const contenido = await fs.readFile(rutaArchivo, "utf-8");
    return JSON.parse(contenido);
  } catch (error) {
    return [];
  }
}

// Sobrescribe el archivo con el arreglo actualizado
async function guardarAprendices(listaAprendices) {
  await fs.writeFile(rutaArchivo, JSON.stringify(listaAprendices, null, 2));
}

module.exports = {
  leerAprendices,
  guardarAprendices,
};
