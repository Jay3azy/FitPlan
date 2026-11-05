import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'food_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('code', 20).notNullable().unique()
      table.string('name', 50).notNullable()
      table.string('description', 200).nullable()

      // Jerarquia padre/hijo (ej. "Proteinas" -> "Carnes rojas", "Pescados").
      // Null = categoria de nivel superior (padre).
      table
        .integer('parent_category_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('food_categories')
        .onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
