import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'foods'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('code', 20).notNullable().unique()
      table.string('name', 100).notNullable()

      // FK a la subcategoria (hoja) de food_categories. En el formulario se
      // arma con 2 selects dependientes: categoria padre -> subcategoria.
      table
        .integer('category_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('food_categories')
        .onDelete('RESTRICT')

      table.decimal('calories', 7, 2).notNullable()
      table.decimal('protein', 7, 2).notNullable()
      table.decimal('carbs', 7, 2).notNullable()
      table.decimal('fat', 7, 2).notNullable()
      table.decimal('sodium', 8, 2).notNullable().defaultTo(0)
      table.decimal('purines', 8, 2).notNullable().defaultTo(0)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
