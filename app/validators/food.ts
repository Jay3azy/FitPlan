import vine from '@vinejs/vine'

/**
 * categoryId debe ser una subcategoria real (hoja) de food_categories;
 * el formulario arma este valor con 2 selects dependientes (categoria
 * padre -> subcategoria), nunca con un input de texto libre.
 * allergenIds es un arreglo opcional de ids de allergies (multiselect).
 */
export const createFoodValidator = vine.create({
  code: vine.string().trim().maxLength(20).unique({ table: 'foods', column: 'code' }),
  name: vine.string().trim().maxLength(100),
  categoryId: vine.number().exists({ table: 'food_categories', column: 'id' }),
  calories: vine.number().min(0),
  protein: vine.number().min(0),
  carbs: vine.number().min(0),
  fat: vine.number().min(0),
  sodium: vine.number().min(0).optional(),
  purines: vine.number().min(0).optional(),
  allergenIds: vine.array(vine.number().exists({ table: 'allergies', column: 'id' })).optional(),
})

export const updateFoodValidator = (foodId: number) =>
  vine.create({
    code: vine
      .string()
      .trim()
      .maxLength(20)
      .unique({ table: 'foods', column: 'code', filter: (db) => { db.whereNot('id', foodId) } }),
    name: vine.string().trim().maxLength(100),
    categoryId: vine.number().exists({ table: 'food_categories', column: 'id' }),
    calories: vine.number().min(0),
    protein: vine.number().min(0),
    carbs: vine.number().min(0),
    fat: vine.number().min(0),
    sodium: vine.number().min(0).optional(),
    purines: vine.number().min(0).optional(),
    allergenIds: vine.array(vine.number().exists({ table: 'allergies', column: 'id' })).optional(),
  })
