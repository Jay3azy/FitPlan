import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'objectives'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('code', 20).notNullable().unique()
      table.string('name', 50).notNullable()
      table.string('description', 200).nullable()
      table.decimal('calorie_adjustment_factor', 5, 2).notNullable()
      table.decimal('protein_factor_per_kg', 5, 2).notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
