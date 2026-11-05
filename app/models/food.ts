import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import FoodCategory from '#models/food_category'
import Allergy from '#models/allergy'

export default class Food extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare name: string

  @column()
  declare categoryId: number

  @belongsTo(() => FoodCategory, { foreignKey: 'categoryId' })
  declare category: BelongsTo<typeof FoodCategory>

  @column()
  declare calories: number

  @column()
  declare protein: number

  @column()
  declare carbs: number

  @column()
  declare fat: number

  @column()
  declare sodium: number

  @column()
  declare purines: number

  @manyToMany(() => Allergy, {
    pivotTable: 'food_allergens',
    localKey: 'id',
    pivotForeignKey: 'food_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'allergy_id',
  })
  declare allergens: ManyToMany<typeof Allergy>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
