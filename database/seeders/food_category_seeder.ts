import { BaseSeeder } from '@adonisjs/lucid/seeders'
import FoodCategory from '#models/food_category'

export default class extends BaseSeeder {
  async run() {
    const parents = await FoodCategory.updateOrCreateMany('code', [
      { code: 'PROTEINAS', name: 'Proteínas', description: 'Fuentes principales de proteína.' },
      { code: 'CARBOHIDRATOS', name: 'Carbohidratos', description: 'Fuentes principales de carbohidratos.' },
      { code: 'GRASAS', name: 'Grasas', description: 'Fuentes de grasas.' },
      { code: 'FRUTAS_VERDURAS', name: 'Frutas y verduras', description: 'Frutas y vegetales.' },
    ])

    const byCode = Object.fromEntries(parents.map((p) => [p.code, p]))

    await FoodCategory.updateOrCreateMany('code', [
      {
        code: 'CARNES_ROJAS',
        name: 'Carnes rojas',
        description: 'Res, cerdo, cordero.',
        parentCategoryId: byCode.PROTEINAS.id,
      },
      {
        code: 'CARNES_BLANCAS',
        name: 'Carnes blancas',
        description: 'Pollo, pavo.',
        parentCategoryId: byCode.PROTEINAS.id,
      },
      {
        code: 'PESCADOS_MARISCOS',
        name: 'Pescados y mariscos',
        description: 'Pescado, camarón, atún.',
        parentCategoryId: byCode.PROTEINAS.id,
      },
      {
        code: 'LEGUMBRES',
        name: 'Legumbres',
        description: 'Lentejas, garbanzos, frejol.',
        parentCategoryId: byCode.CARBOHIDRATOS.id,
      },
      {
        code: 'CEREALES',
        name: 'Cereales',
        description: 'Arroz, avena, quinoa.',
        parentCategoryId: byCode.CARBOHIDRATOS.id,
      },
      {
        code: 'TUBERCULOS',
        name: 'Tubérculos',
        description: 'Papa, yuca, camote.',
        parentCategoryId: byCode.CARBOHIDRATOS.id,
      },
      {
        code: 'GRASAS_SALUDABLES',
        name: 'Grasas saludables',
        description: 'Aguacate, aceite de oliva, nueces.',
        parentCategoryId: byCode.GRASAS.id,
      },
      {
        code: 'FRUTAS',
        name: 'Frutas',
        description: 'Frutas frescas.',
        parentCategoryId: byCode.FRUTAS_VERDURAS.id,
      },
      {
        code: 'VERDURAS',
        name: 'Verduras',
        description: 'Vegetales de hoja verde y otros.',
        parentCategoryId: byCode.FRUTAS_VERDURAS.id,
      },
    ])
  }
}
