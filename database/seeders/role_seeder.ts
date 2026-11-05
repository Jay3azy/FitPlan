import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    await Role.updateOrCreateMany('code', [
      { code: 'ADMIN', name: 'Administrador', description: 'Administra los catálogos y usuarios del sistema.' },
      { code: 'NUTRI', name: 'Nutricionista', description: 'Revisa y aprueba las dietas semanales generadas.' },
      { code: 'CLIENTE', name: 'Cliente', description: 'Consume el servicio de dietas personalizadas.' },
    ])
  }
}
