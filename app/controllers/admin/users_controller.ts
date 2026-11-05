import User from '#models/user'
import Role from '#models/role'
import { createUserValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Administración de Usuarios. Alimenta el Core (cada usuario con rol
 * CLIENTE es quien recibe un plan de dieta semanal generado por el core).
 *
 * El dato sensible de este catálogo es la cédula: se valida en backend
 * (ver app/validators/rules/cedula_ecuatoriana.ts), nunca solo en el
 * cliente/JS, antes de ser grabada en la base de datos.
 */
export default class UsersController {
  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const users = await User.query()
      .preload('role')
      .orderBy('lastName', 'asc')
      .paginate(page, 15)
    users.baseUrl(request.url())

    return view.render('pages/admin/users/index', { users })
  }

  async create({ view }: HttpContext) {
    const roles = await Role.query().orderBy('name', 'asc')
    return view.render('pages/admin/users/create', { roles })
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)
    await User.create(data)

    session.flash('success', 'Usuario creado correctamente.')
    return response.redirect().toRoute('admin.users.index')
  }

  async edit({ params, view, response, session }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      session.flash('error', 'El usuario no existe.')
      return response.redirect().toRoute('admin.users.index')
    }

    const roles = await Role.query().orderBy('name', 'asc')
    return view.render('pages/admin/users/edit', { user, roles })
  }

  async update({ params, request, response, session }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      session.flash('error', 'El usuario no existe.')
      return response.redirect().toRoute('admin.users.index')
    }

    // Un campo de contraseña vacío significa "no cambiar": lo quitamos
    // antes de validar para que `.optional()` lo trate como ausente en
    // vez de fallar la regla de longitud mínima con una cadena vacía.
    if (request.input('password') === '') {
      request.updateBody({ ...request.body(), password: undefined })
    }

    const data = await request.validateUsing(updateUserValidator(user.id))

    // La contraseña es opcional al editar: solo se reescribe si llega un
    // valor nuevo, para no forzar al admin a reingresarla cada vez.
    const { password, ...rest } = data
    user.merge(rest)
    if (password) {
      user.password = password
    }
    await user.save()

    session.flash('success', 'Usuario actualizado correctamente.')
    return response.redirect().toRoute('admin.users.index')
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      session.flash('error', 'El usuario no existe.')
      return response.redirect().toRoute('admin.users.index')
    }

    if (user.id === auth.user!.id) {
      session.flash('error', 'No puedes eliminar tu propio usuario.')
      return response.redirect().toRoute('admin.users.index')
    }

    await user.delete()
    session.flash('success', 'Usuario eliminado.')
    return response.redirect().toRoute('admin.users.index')
  }
}
