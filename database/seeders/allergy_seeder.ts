import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Allergy from '#models/allergy'

export default class extends BaseSeeder {
  async run() {
    await Allergy.updateOrCreateMany('code', [
      { code: 'GLUTEN', name: 'Gluten', description: 'Presente en trigo, cebada y centeno.' },
      { code: 'LACTOSA', name: 'Lácteos', description: 'Leche y derivados lácteos.' },
      { code: 'FRUTOS_SECOS', name: 'Frutos secos', description: 'Nueces, almendras, maní, etc.' },
      { code: 'MARISCOS', name: 'Mariscos', description: 'Camarón, langosta, cangrejo, etc.' },
    ])
  }
}
