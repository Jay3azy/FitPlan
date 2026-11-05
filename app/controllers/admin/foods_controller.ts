import Food from '#models/food'
import FoodCategory from '#models/food_category'
import Allergy from '#models/allergy'
import { createFoodValidator, updateFoodValidator } from '#validators/food'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Catálogo de Alimentos. Cada alimento pertenece a una subcategoría (hoja)
 * de food_categories y puede estar vinculado a una o más alergias
 * (food_allergens). El core usa calorías/macros/sodio/purinas de cada
 * alimento para armar la dieta semanal, excluyendo los que coincidan con
 * las alergias o superen los topes de la condición médica del cliente.
 *
 * El formulario NO permite escribir la FK de categoría a mano: se arma
 * con 2 selects dependientes (categoría padre -> subcategoría), tal como
 * pidió el profesor para cualquier referencia a otra tabla.
 */
export default class FoodsController {
  async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const foods = await Food.query()
      .preload('category')
      .preload('allergens')
      .orderBy('name', 'asc')
      .paginate(page, 15)
    foods.baseUrl(request.url())

    return view.render('pages/admin/foods/index', { foods })
  }

  async create({ view }: HttpContext) {
    const [categoryTree, allergies] = await this.sharedFormData()
    return view.render('pages/admin/foods/create', { categoryTree, allergies })
  }

  async store({ request, response, session }: HttpContext) {
    this.stripEmptyOptionals(request)
    const data = await request.validateUsing(createFoodValidator)

    const error = await this.assertIsSubcategory(data.categoryId)
    if (error) {
      session.flash('error', error)
      return response.redirect().toRoute('admin.foods.create')
    }

    const { allergenIds, ...foodData } = data
    const food = await Food.create(foodData)
    if (allergenIds) {
      await food.related('allergens').sync(allergenIds)
    }

    session.flash('success', 'Alimento creado correctamente.')
    return response.redirect().toRoute('admin.foods.index')
  }

  async edit({ params, view, response, session }: HttpContext) {
    const food = await Food.query()
      .where('id', params.id)
      .preload('category')
      .preload('allergens')
      .first()
    if (!food) {
      session.flash('error', 'El alimento no existe.')
      return response.redirect().toRoute('admin.foods.index')
    }

    const [categoryTree, allergies] = await this.sharedFormData()
    return view.render('pages/admin/foods/edit', { food, categoryTree, allergies })
  }

  async update({ params, request, response, session }: HttpContext) {
    const food = await Food.find(params.id)
    if (!food) {
      session.flash('error', 'El alimento no existe.')
      return response.redirect().toRoute('admin.foods.index')
    }

    this.stripEmptyOptionals(request)
    const data = await request.validateUsing(updateFoodValidator(food.id))

    const error = await this.assertIsSubcategory(data.categoryId)
    if (error) {
      session.flash('error', error)
      return response.redirect().toRoute('admin.foods.edit', { id: food.id })
    }

    const { allergenIds, ...foodData } = data
    food.merge(foodData)
    await food.save()
    await food.related('allergens').sync(allergenIds ?? [])

    session.flash('success', 'Alimento actualizado correctamente.')
    return response.redirect().toRoute('admin.foods.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const food = await Food.find(params.id)
    if (!food) {
      session.flash('error', 'El alimento no existe.')
      return response.redirect().toRoute('admin.foods.index')
    }

    await food.delete()
    session.flash('success', 'Alimento eliminado.')
    return response.redirect().toRoute('admin.foods.index')
  }

  /**
   * Arbol de categorias (padre + subcategorias) para armar los 2 selects
   * dependientes en el formulario, y la lista de alergias para el
   * multiselect.
   */
  private async sharedFormData() {
    const categoryTree = await FoodCategory.query()
      .whereNull('parent_category_id')
      .preload('subcategories', (q) => q.orderBy('name', 'asc'))
      .orderBy('name', 'asc')
    const allergies = await Allergy.query().orderBy('name', 'asc')
    return [categoryTree, allergies] as const
  }

  /**
   * Un alimento solo puede apuntar a una subcategoria (hoja), nunca a una
   * categoria de nivel superior.
   */
  private async assertIsSubcategory(categoryId: number) {
    const category = await FoodCategory.find(categoryId)
    if (!category || category.parentCategoryId === null) {
      return 'Debes elegir una subcategoría (no una categoría de nivel superior).'
    }
    return null
  }

  private stripEmptyOptionals(request: HttpContext['request']) {
    const body = { ...request.body() }
    for (const key of ['sodium', 'purines']) {
      if (body[key] === '') delete body[key]
    }
    if (!body.allergenIds || (Array.isArray(body.allergenIds) && body.allergenIds.length === 0)) {
      delete body.allergenIds
    }
    request.updateBody(body)
  }
}
