import FoodCategory from '#models/food_category'
import {
  createFoodCategoryValidator,
  updateFoodCategoryValidator,
} from '#validators/food_category'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Catálogo jerárquico de Categorías de alimentos (ej. Proteínas -> Carnes
 * rojas, Pescados). Esta jerarquía es la que alimenta el dropdown
 * dependiente categoría -> subcategoría del formulario de Alimentos
 * (Fase 4): aquí solo se administran los 2 niveles.
 */
export default class FoodCategoriesController {
  async index({ view }: HttpContext) {
    // Cargamos solo las categorias padre con sus subcategorias, para
    // listar el arbol completo en una sola pasada.
    const parents = await FoodCategory.query()
      .whereNull('parent_category_id')
      .preload('subcategories', (q) => q.orderBy('name', 'asc'))
      .orderBy('name', 'asc')

    return view.render('pages/admin/food_categories/index', { parents })
  }

  async create({ view }: HttpContext) {
    const parentOptions = await FoodCategory.query()
      .whereNull('parent_category_id')
      .orderBy('name', 'asc')
    return view.render('pages/admin/food_categories/create', { parentOptions })
  }

  async store({ request, response, session }: HttpContext) {
    this.stripEmptyOptionals(request)
    const data = await request.validateUsing(createFoodCategoryValidator)

    const error = await this.assertValidParent(data.parentCategoryId)
    if (error) {
      session.flash('error', error)
      return response.redirect().toRoute('admin.food_categories.create')
    }

    await FoodCategory.create(data)
    session.flash('success', 'Categoría creada correctamente.')
    return response.redirect().toRoute('admin.food_categories.index')
  }

  async edit({ params, view, response, session }: HttpContext) {
    const category = await FoodCategory.find(params.id)
    if (!category) {
      session.flash('error', 'La categoría no existe.')
      return response.redirect().toRoute('admin.food_categories.index')
    }

    // Una categoria no puede ser su propia subcategoria: la excluimos de
    // las opciones de padre al editarla.
    const parentOptions = await FoodCategory.query()
      .whereNull('parent_category_id')
      .whereNot('id', category.id)
      .orderBy('name', 'asc')

    return view.render('pages/admin/food_categories/edit', { category, parentOptions })
  }

  async update({ params, request, response, session }: HttpContext) {
    const category = await FoodCategory.find(params.id)
    if (!category) {
      session.flash('error', 'La categoría no existe.')
      return response.redirect().toRoute('admin.food_categories.index')
    }

    this.stripEmptyOptionals(request)
    const data = await request.validateUsing(updateFoodCategoryValidator(category.id))

    if (data.parentCategoryId === category.id) {
      session.flash('error', 'Una categoría no puede ser su propia subcategoría.')
      return response.redirect().toRoute('admin.food_categories.edit', { id: category.id })
    }

    const error = await this.assertValidParent(data.parentCategoryId)
    if (error) {
      session.flash('error', error)
      return response.redirect().toRoute('admin.food_categories.edit', { id: category.id })
    }

    // Si esta categoria tiene subcategorias propias, no puede pasar a ser
    // subcategoria de otra (evita jerarquias de mas de 2 niveles).
    if (data.parentCategoryId) {
      const hasChildren = await FoodCategory.query()
        .where('parent_category_id', category.id)
        .first()
      if (hasChildren) {
        session.flash(
          'error',
          'Esta categoría tiene subcategorías propias; no puede convertirse en subcategoría de otra.'
        )
        return response.redirect().toRoute('admin.food_categories.edit', { id: category.id })
      }
    }

    category.merge(data)
    category.parentCategoryId = data.parentCategoryId ?? null
    await category.save()

    session.flash('success', 'Categoría actualizada correctamente.')
    return response.redirect().toRoute('admin.food_categories.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const category = await FoodCategory.find(params.id)
    if (!category) {
      session.flash('error', 'La categoría no existe.')
      return response.redirect().toRoute('admin.food_categories.index')
    }

    const [hasChildren, hasFoods] = await Promise.all([
      FoodCategory.query().where('parent_category_id', category.id).first(),
      category.related('foods').query().first(),
    ])

    if (hasChildren) {
      session.flash('error', 'No se puede eliminar: tiene subcategorías asociadas.')
      return response.redirect().toRoute('admin.food_categories.index')
    }
    if (hasFoods) {
      session.flash('error', 'No se puede eliminar: tiene alimentos asociados.')
      return response.redirect().toRoute('admin.food_categories.index')
    }

    await category.delete()
    session.flash('success', 'Categoría eliminada.')
    return response.redirect().toRoute('admin.food_categories.index')
  }

  /**
   * Un padre valido debe existir y no tener padre propio (solo 2 niveles
   * de jerarquia). Devuelve un mensaje de error, o null si es valido.
   */
  private async assertValidParent(parentCategoryId: number | null | undefined) {
    if (!parentCategoryId) return null
    const parent = await FoodCategory.find(parentCategoryId)
    if (!parent || parent.parentCategoryId !== null) {
      return 'La categoría padre debe ser una categoría de nivel superior.'
    }
    return null
  }

  private stripEmptyOptionals(request: HttpContext['request']) {
    const body = { ...request.body() }
    for (const key of ['description', 'parentCategoryId']) {
      if (body[key] === '') delete body[key]
    }
    request.updateBody(body)
  }
}
