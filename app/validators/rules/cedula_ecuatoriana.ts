import vine from '@vinejs/vine'

/**
 * Valida el numero de cedula de identidad ecuatoriana.
 *
 * Este es el "dato sensible" del core (requisito 1 de la tarea): la
 * validacion NO puede confiarse solo al front-end (JS), por lo que esta
 * regla se ejecuta siempre en el servidor, dentro del validador de Vine,
 * antes de persistir el registro en la base de datos.
 *
 * Reglas del algoritmo oficial (Registro Civil del Ecuador):
 *  1. Debe tener exactamente 10 digitos numericos.
 *  2. Los dos primeros digitos (codigo de provincia) deben estar entre
 *     01 y 24 (o 30 para extranjeros residentes, que se excluye aqui
 *     porque el formulario es solo para personas naturales).
 *  3. El tercer digito debe ser menor a 6 (0-5) para persona natural.
 *  4. El digito verificador (posicion 10) se calcula con el algoritmo de
 *     Modulo 10: multiplicar alternadamente por 2 y 1 los primeros 9
 *     digitos, si el resultado de x2 supera 9 se le resta 9, se suman
 *     todos los productos y el digito verificador es lo que falta para
 *     llegar al siguiente multiplo de 10.
 */
function esCedulaEcuatorianaValida(cedula: string): boolean {
  if (!/^\d{10}$/.test(cedula)) {
    return false
  }

  const digitos = cedula.split('').map(Number)
  const codigoProvincia = Number(cedula.slice(0, 2))
  const tercerDigito = digitos[2]

  if (codigoProvincia < 1 || codigoProvincia > 24) {
    return false
  }

  if (tercerDigito > 5) {
    return false
  }

  const digitoVerificador = digitos[9]
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]

  const suma = coeficientes.reduce((acc, coeficiente, index) => {
    let producto = digitos[index] * coeficiente
    if (producto > 9) producto -= 9
    return acc + producto
  }, 0)

  const siguienteDecena = Math.ceil(suma / 10) * 10
  const digitoCalculado = siguienteDecena - suma === 10 ? 0 : siguienteDecena - suma

  return digitoCalculado === digitoVerificador
}

export const cedulaEcuatoriana = vine.createRule((value, _options, field) => {
  if (typeof value !== 'string' || !esCedulaEcuatorianaValida(value)) {
    field.report('El campo {{ field }} no es una cédula ecuatoriana válida', 'cedulaEcuatoriana', field)
  }
})
