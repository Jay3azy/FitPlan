import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const adminRole = await Role.findByOrFail('code', 'ADMIN')

    await User.updateOrCreateMany('email', [
      {
        email: 'admin@nutriplan.test',
        password: 'Admin1234',
        firstName: 'José',
        lastName: 'Ortiz',
        // Cedula valida (algoritmo modulo 10) usada solo para pruebas/demo.
        cedula: '1712345675',
        roleId: adminRole.id,
      },
    ])
  }
}
