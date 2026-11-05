import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'food_allergens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('food_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('foods')
        .onDelete('CASCADE')

      table
        .integer('allergy_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('allergies')
        .onDelete('CASCADE')

      table.primary(['food_id', 'allergy_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
