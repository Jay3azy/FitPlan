import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('first_name', 50).notNullable()
      table.string('last_name', 50).notNullable()

      // Dato sensible: cedula ecuatoriana. Se valida con el algoritmo
      // oficial (provincia + tercer digito + digito verificador modulo 10)
      // en el backend (app/validators + regla custom), nunca solo en JS.
      table.string('cedula', 10).notNullable().unique()

      table.date('birth_date').nullable()

      table
        .integer('role_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('roles')
        .onDelete('RESTRICT')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
