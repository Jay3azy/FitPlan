import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Objective from '#models/objective'

export default class extends BaseSeeder {
  async run() {
    await Objective.updateOrCreateMany('code', [
      {
        code: 'BAJAR_PESO',
        name: 'Bajar de peso',
        description: 'Déficit calórico controlado para reducción de grasa corporal.',
        calorieAdjustmentFactor: 0.8,
        proteinFactorPerKg: 1.8,
      },
      {
        code: 'GANAR_MASA',
        name: 'Ganar masa muscular',
        description: 'Superávit calórico con alta ingesta de proteína.',
        calorieAdjustmentFactor: 1.15,
        proteinFactorPerKg: 2.2,
      },
      {
        code: 'MANTENIMIENTO',
        name: 'Mantenimiento',
        description: 'Sin ajuste calórico; conserva el peso actual.',
        calorieAdjustmentFactor: 1.0,
        proteinFactorPerKg: 1.6,
      },
    ])
  }
}
