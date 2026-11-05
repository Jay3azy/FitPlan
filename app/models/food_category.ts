import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Food from '#models/food'

export default class FoodCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  /**
   * Null = categoria padre (nivel superior). Con valor = subcategoria.
   * Esta jerarquia alimenta el dropdown dependiente del formulario de
   * Alimentos (categoria padre -> subcategorias).
   */
  @column()
  declare parentCategoryId: number | null

  @belongsTo(() => FoodCategory, { foreignKey: 'parentCategoryId' })
  declare parentCategory: BelongsTo<typeof FoodCategory>

  @hasMany(() => FoodCategory, { foreignKey: 'parentCategoryId' })
  declare subcategories: HasMany<typeof FoodCategory>

  @hasMany(() => Food, { foreignKey: 'categoryId' })
  declare foods: HasMany<typeof Food>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
