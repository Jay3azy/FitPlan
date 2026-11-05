import Allergy from '#models/allergy'
import { createAllergyValidator, updateAllergyValidator } from '#validators/allergy'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Catálogo de Alergias. El core excluye de la dieta semanal cualquier
 * alimento vinculado (tabla pivote food_allergens) a una alergia que el
 * cliente haya declarado.
 */
export default class AllergiesController {
  async index({ view }: HttpContext) {
    const allergies = await Allergy.query().orderBy('name', 'asc')
    return view.render('pages/admin/allergies/index', { allergies })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/admin/allergies/create')
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createAllergyValidator)
    await Allergy.create(data)

    session.flash('success', 'Alergia creada correctamente.')
    return response.redirect().toRoute('admin.allergies.index')
  }

  async edit({ params, view, response, session }: HttpContext) {
    const allergy = await Allergy.find(params.id)
    if (!allergy) {
      session.flash('error', 'La alergia no existe.')
      return response.redirect().toRoute('admin.allergies.index')
    }
    return view.render('pages/admin/allergies/edit', { allergy })
  }

  async update({ params, request, response, session }: HttpContext) {
    const allergy = await Allergy.find(params.id)
    if (!allergy) {
      session.flash('error', 'La alergia no existe.')
      return response.redirect().toRoute('admin.allergies.index')
    }

    const data = await request.validateUsing(updateAllergyValidator(allergy.id))
    allergy.merge(data)
    await allergy.save()

    session.flash('success', 'Alergia actualizada correctamente.')
    return response.redirect().toRoute('admin.allergies.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const allergy = await Allergy.find(params.id)
    if (!allergy) {
      session.flash('error', 'La alergia no existe.')
      return response.redirect().toRoute('admin.allergies.index')
    }

    await allergy.delete()
    session.flash('success', 'Alergia eliminada.')
    return response.redirect().toRoute('admin.allergies.index')
  }
}
