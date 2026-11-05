import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'conditions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('code', 20).notNullable().unique()
      table.string('name', 50).notNullable()
      table.string('description', 200).nullable()
      table.decimal('max_sodium_mg', 8, 2).nullable()
      table.decimal('max_purines_mg', 8, 2).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
