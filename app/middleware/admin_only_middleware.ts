import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Restringe el acceso al módulo de Administración (los 6 catálogos que
 * alimentan el Core) únicamente a usuarios con rol ADMIN. Se asume que
 * `auth_middleware` ya corrió antes (grupo /admin usa ambos), por lo que
 * ctx.auth.user siempre existe aquí.
 */
export default class AdminOnlyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user!
    await user.load('role')

    if (user.role.code !== 'ADMIN') {
      ctx.session.flash('error', 'No tienes permisos para acceder a la administración.')
      return ctx.response.redirect().toRoute('dashboard')
    }

    return next()
  }
}
