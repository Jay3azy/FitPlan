import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Condition from '#models/condition'

export default class extends BaseSeeder {
  async run() {
    await Condition.updateOrCreateMany('code', [
      {
        code: 'HIPERTENSION',
        name: 'Hipertensión',
        description: 'Limita el sodio diario permitido en la dieta.',
        maxSodiumMg: 1500,
        maxPurinesMg: null,
      },
      {
        code: 'GOTA',
        name: 'Gota',
        description: 'Limita las purinas diarias permitidas en la dieta.',
        maxSodiumMg: null,
        maxPurinesMg: 400,
      },
    ])
  }
}
