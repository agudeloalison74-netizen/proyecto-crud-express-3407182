const { leerAprendices, guardarAprendices } = require("../models/aprendizModel");
const { validarNombre, validarCorreo, validarId } = require("../validaciones/validaciones");

// GET /api/aprendices - obtener todos los aprendices
async function listarAprendices(req, res, next) {
  try {
    const listaAprendices = await leerAprendices();
    res.status(200).json({ Listado: listaAprendices });
  } catch (error) {
    next(error);
  }
}

// GET /api/aprendices/:id - obtener un aprendiz por id
async function obtenerAprendizPorId(req, res, next) {
  try {
    const { id } = req.params;

    const validacion = validarId(id);
    if (!validacion.valido) {
      return res.status(400).json({ error: validacion.mensaje });
    }

    const listaAprendices = await leerAprendices();
    const aprendiz = listaAprendices.find((a) => Number(a.id) === validacion.idNumero);

    if (!aprendiz) {
      return res.status(404).json({ error: "Aprendiz no encontrado" });
    }

    res.status(200).json(aprendiz);
  } catch (error) {
    next(error);
  }
}

// POST /api/aprendices - crear un aprendiz nuevo con ID automático
async function crearAprendiz(req, res, next) {
  try {
    const datosAprendiz = req.body || {};

    const resultadoNombre = validarNombre(datosAprendiz.nombre);
    if (!resultadoNombre.valido) {
      return res.status(400).json({ Error: resultadoNombre.mensaje });
    }

    const resultadoCorreo = validarCorreo(datosAprendiz.correo);
    if (!resultadoCorreo.valido) {
      return res.status(400).json({ Error: resultadoCorreo.mensaje });
    }

    const listaAprendices = await leerAprendices();

    const aprendicesValidos = listaAprendices.filter((item) => item && item.id !== undefined);
    const ultimoId = aprendicesValidos.length > 0
      ? Number(aprendicesValidos[aprendicesValidos.length - 1].id)
      : 0;

    const nuevoAprendiz = {
      id: ultimoId + 1,
      ...datosAprendiz,
      imagen: req.file ? `/misimagenes/${req.file.filename}` : "sin_imagen",
    };

    listaAprendices.push(nuevoAprendiz);
    await guardarAprendices(listaAprendices);

    res.status(201).json({ Mensaje: "creado", Datos: nuevoAprendiz });
  } catch (error) {
    next(error);
  }
}

// PUT /api/aprendices/:id - actualizar un aprendiz existente
async function actualizarAprendiz(req, res, next) {
  try {
    const { id } = req.params;

    const validacion = validarId(id);
    if (!validacion.valido) {
      return res.status(400).json({ error: validacion.mensaje });
    }

    const datosNuevos = req.body || {};

    // Solo se valida nombre/correo si vienen en la petición (actualización parcial)
    if (datosNuevos.nombre !== undefined) {
      const resultadoNombre = validarNombre(datosNuevos.nombre);
      if (!resultadoNombre.valido) {
        return res.status(400).json({ Error: resultadoNombre.mensaje });
      }
    }

    if (datosNuevos.correo !== undefined) {
      const resultadoCorreo = validarCorreo(datosNuevos.correo);
      if (!resultadoCorreo.valido) {
        return res.status(400).json({ Error: resultadoCorreo.mensaje });
      }
    }

    const listaAprendices = await leerAprendices();
    const indice = listaAprendices.findIndex((a) => Number(a.id) === validacion.idNumero);

    if (indice === -1) {
      return res.status(404).json({ error: "Aprendiz no encontrado" });
    }

    const aprendizActualizado = {
      ...listaAprendices[indice],
      ...datosNuevos,
      id: listaAprendices[indice].id, // el id nunca se sobrescribe
      imagen: req.file ? `/misimagenes/${req.file.filename}` : listaAprendices[indice].imagen,
    };

    listaAprendices[indice] = aprendizActualizado;
    await guardarAprendices(listaAprendices);

    res.status(200).json({ Mensaje: "actualizado", Datos: aprendizActualizado });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/aprendices/:id - eliminar un aprendiz por id
async function eliminarAprendiz(req, res, next) {
  try {
    const { id } = req.params;

    const validacion = validarId(id);
    if (!validacion.valido) {
      return res.status(400).json({ error: validacion.mensaje });
    }

    const listaAprendices = await leerAprendices();
    const indice = listaAprendices.findIndex((a) => Number(a.id) === validacion.idNumero);

    if (indice === -1) {
      return res.status(404).json({ error: "Aprendiz no encontrado" });
    }

    const [aprendizEliminado] = listaAprendices.splice(indice, 1);
    await guardarAprendices(listaAprendices);

    res.status(200).json({ Mensaje: "eliminado", Datos: aprendizEliminado });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarAprendices,
  obtenerAprendizPorId,
  crearAprendiz,
  actualizarAprendiz,
  eliminarAprendiz,
};
