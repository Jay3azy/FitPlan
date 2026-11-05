import Condition from '#models/condition'
import { createConditionValidator, updateConditionValidator } from '#validators/condition'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Catálogo de Condiciones médicas (hipertensión, gota). El core usa
 * maxSodiumMg / maxPurinesMg como tope diario al generar la dieta
 * semanal de un cliente que declare esa condición.
 */
export default class ConditionsController {
  async index({ view }: HttpContext) {
    const conditions = await Condition.query().orderBy('name', 'asc')
    return view.render('pages/admin/conditions/index', { conditions })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/admin/conditions/create')
  }

  async store({ request, response, session }: HttpContext) {
    this.stripEmptyOptionals(request)
    const data = await request.validateUsing(createConditionValidator)
    await Condition.create(data)

    session.flash('success', 'Condición creada correctamente.')
    return response.redirect().toRoute('admin.conditions.index')
  }

  async edit({ params, view, response, session }: HttpContext) {
    const condition = await Condition.find(params.id)
    if (!condition) {
      session.flash('error', 'La condición no existe.')
      return response.redirect().toRoute('admin.conditions.index')
    }
    return view.render('pages/admin/conditions/edit', { condition })
  }

  async update({ params, request, response, session }: HttpContext) {
    const condition = await Condition.find(params.id)
    if (!condition) {
      session.flash('error', 'La condición no existe.')
      return response.redirect().toRoute('admin.conditions.index')
    }

    this.stripEmptyOptionals(request)
    const data = await request.validateUsing(updateConditionValidator(condition.id))
    condition.merge(data)
    condition.maxSodiumMg = data.maxSodiumMg ?? null
    condition.maxPurinesMg = data.maxPurinesMg ?? null
    await condition.save()

    session.flash('success', 'Condición actualizada correctamente.')
    return response.redirect().toRoute('admin.conditions.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const condition = await Condition.find(params.id)
    if (!condition) {
      session.flash('error', 'La condición no existe.')
      return response.redirect().toRoute('admin.conditions.index')
    }

    await condition.delete()
    session.flash('success', 'Condición eliminada.')
    return response.redirect().toRoute('admin.conditions.index')
  }

  private stripEmptyOptionals(request: HttpContext['request']) {
    const body = { ...request.body() }
    for (const key of ['description', 'maxSodiumMg', 'maxPurinesMg']) {
      if (body[key] === '') delete body[key]
    }
    request.updateBody(body)
  }
}
