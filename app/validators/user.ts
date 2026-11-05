import vine from '@vinejs/vine'
import { cedulaEcuatoriana } from '#validators/rules/cedula_ecuatoriana'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)
const cedula = () => vine.string().fixedLength(10).use(cedulaEcuatoriana())

/**
 * Validador para iniciar sesion.
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})

/**
 * Validador para crear un usuario (desde la administracion).
 * roleId debe existir en la tabla roles; email y cedula deben ser unicos.
 */
export const createUserValidator = vine.create({
  firstName: vine.string().trim().minLength(2).maxLength(50),
  lastName: vine.string().trim().minLength(2).maxLength(50),
  email: email().unique({ table: 'users', column: 'email' }),
  cedula: cedula().unique({ table: 'users', column: 'cedula' }),
  birthDate: vine.date().optional(),
  roleId: vine.number().exists({ table: 'roles', column: 'id' }),
  password: password(),
})

/**
 * Validador para editar un usuario existente.
 * email/cedula deben seguir siendo unicos, pero ignorando el propio
 * registro (whereNot id). La contrasena es opcional (solo se cambia si
 * se envia un valor nuevo).
 */
export const updateUserValidator = (userId: number) =>
  vine.create({
    firstName: vine.string().trim().minLength(2).maxLength(50),
    lastName: vine.string().trim().minLength(2).maxLength(50),
    email: email().unique({
      table: 'users',
      column: 'email',
      filter: (db) => { db.whereNot('id', userId) },
    }),
    cedula: cedula().unique({
      table: 'users',
      column: 'cedula',
      filter: (db) => { db.whereNot('id', userId) },
    }),
    birthDate: vine.date().optional(),
    roleId: vine.number().exists({ table: 'roles', column: 'id' }),
    password: password().optional(),
  })
