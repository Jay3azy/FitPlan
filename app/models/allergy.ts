import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Food from '#models/food'

export default class Allergy extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @manyToMany(() => Food, {
    pivotTable: 'food_allergens',
    localKey: 'id',
    pivotForeignKey: 'allergy_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'food_id',
  })
  declare foods: ManyToMany<typeof Food>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
