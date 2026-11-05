import vine from '@vinejs/vine'

/**
 * parentCategoryId es opcional: si viene, debe existir en food_categories
 * (y, a nivel de controlador, debe ser una categoria SIN padre, es decir
 * una categoria de nivel superior; eso no lo puede expresar Vine solo, se
 * valida en el controlador).
 */
export const createFoodCategoryValidator = vine.create({
  code: vine.string().trim().maxLength(20).unique({ table: 'food_categories', column: 'code' }),
  name: vine.string().trim().maxLength(50),
  description: vine.string().trim().maxLength(200).optional(),
  parentCategoryId: vine
    .number()
    .exists({ table: 'food_categories', column: 'id' })
    .optional(),
})

export const updateFoodCategoryValidator = (categoryId: number) =>
  vine.create({
    code: vine
      .string()
      .trim()
      .maxLength(20)
      .unique({ table: 'food_categories', column: 'code', filter: (db) => { db.whereNot('id', categoryId) } }),
    name: vine.string().trim().maxLength(50),
    description: vine.string().trim().maxLength(200).optional(),
    parentCategoryId: vine
      .number()
      .exists({ table: 'food_categories', column: 'id' })
      .optional(),
  })
