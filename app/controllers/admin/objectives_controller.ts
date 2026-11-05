import Objective from '#models/objective'
import { createObjectiveValidator, updateObjectiveValidator } from '#validators/objective'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Catálogo de Objetivos (bajar de peso / ganar masa / mantenimiento).
 * El core usa calorieAdjustmentFactor y proteinFactorPerKg de cada
 * objetivo para calcular el plan semanal del cliente.
 */
export default class ObjectivesController {
  async index({ view }: HttpContext) {
    const objectives = await Objective.query().orderBy('name', 'asc')
    return view.render('pages/admin/objectives/index', { objectives })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/admin/objectives/create')
  }

  async store({ request, response, session }: HttpContext) {
    this.stripEmptyOptionals(request)
    const data = await request.validateUsing(createObjectiveValidator)
    await Objective.create(data)

    session.flash('success', 'Objetivo creado correctamente.')
    return response.redirect().toRoute('admin.objectives.index')
  }

  async edit({ params, view, response, session }: HttpContext) {
    const objective = await Objective.find(params.id)
    if (!objective) {
      session.flash('error', 'El objetivo no existe.')
      return response.redirect().toRoute('admin.objectives.index')
    }
    return view.render('pages/admin/objectives/edit', { objective })
  }

  async update({ params, request, response, session }: HttpContext) {
    const objective = await Objective.find(params.id)
    if (!objective) {
      session.flash('error', 'El objetivo no existe.')
      return response.redirect().toRoute('admin.objectives.index')
    }

    this.stripEmptyOptionals(request)
    const data = await request.validateUsing(updateObjectiveValidator(objective.id))
    objective.merge(data)
    await objective.save()

    session.flash('success', 'Objetivo actualizado correctamente.')
    return response.redirect().toRoute('admin.objectives.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const objective = await Objective.find(params.id)
    if (!objective) {
      session.flash('error', 'El objetivo no existe.')
      return response.redirect().toRoute('admin.objectives.index')
    }

    await objective.delete()
    session.flash('success', 'Objetivo eliminado.')
    return response.redirect().toRoute('admin.objectives.index')
  }

  /**
   * Un <input> HTML vacío llega como "" y no como ausente, lo que rompe
   * `.optional()` en VineJS (intenta coercionar "" a número y falla).
   * Quitamos del body los campos opcionales que llegaron vacíos.
   */
  private stripEmptyOptionals(request: HttpContext['request']) {
    const body = { ...request.body() }
    for (const key of ['description']) {
      if (body[key] === '') delete body[key]
    }
    request.updateBody(body)
  }
}
