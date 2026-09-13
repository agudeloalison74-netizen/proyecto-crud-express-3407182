// name > 3 letras
// correo expresiones regulares
// id: 

/**
 * Valida que el nombre tenga al menos 3 letras.
 * - No permite vacío ni solo espacios.
 * - Solo acepta letras (incluye tildes y ñ) y espacios.
 */
function validarNombre(nombre) {
  if (typeof nombre !== "string") {
    return { valido: false, mensaje: "El nombre es obligatorio y debe ser texto" };
  }

  const nombreLimpio = nombre.trim();
  const regexSoloLetras = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;

  if (nombreLimpio.length < 3) {
    return { valido: false, mensaje: "El nombre debe tener mínimo 3 letras" };
  }

  return { valido: true, mensaje: "Nombre válido" };
}

/**
 * Valida el formato del correo electrónico usando expresiones regulares.
 * Formato esperado: algo@algo.algo
 */
function validarCorreo(correo) {
  if (typeof correo !== "string") {
    return { valido: false, mensaje: "El correo es obligatorio y debe ser texto" };
  }

  const correoLimpio = correo.trim();
  const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regexCorreo.test(correoLimpio)) {
    return { valido: false, mensaje: "El correo electrónico no tiene un formato válido" };
  }

  return { valido: true, mensaje: "Correo válido" };
}

/**
 * Valida que el id sea un número entero positivo.
 * Útil para los parámetros de rutas como /api/aprendices/:id
 */
function validarId(id) {
  if (id === undefined || id === null || id === "") {
    return { valido: false, mensaje: "El id es obligatorio" };
  }

  const idNumero = Number(id);

  if (!Number.isInteger(idNumero) || idNumero < 0) {
    return { valido: false, mensaje: "El id debe ser un número entero válido" };
  }

  return { valido: true, mensaje: "Id válido", idNumero };
}

module.exports = {
  validarNombre,
  validarCorreo,
  validarId,
};
