import vine from '@vinejs/vine'

export const createObjectiveValidator = vine.create({
  code: vine.string().trim().maxLength(20).unique({ table: 'objectives', column: 'code' }),
  name: vine.string().trim().maxLength(50),
  description: vine.string().trim().maxLength(200).optional(),
  calorieAdjustmentFactor: vine.number().range([0.1, 3]),
  proteinFactorPerKg: vine.number().range([0.1, 10]),
})

export const updateObjectiveValidator = (objectiveId: number) =>
  vine.create({
    code: vine
      .string()
      .trim()
      .maxLength(20)
      .unique({ table: 'objectives', column: 'code', filter: (db) => { db.whereNot('id', objectiveId) } }),
    name: vine.string().trim().maxLength(50),
    description: vine.string().trim().maxLength(200).optional(),
    calorieAdjustmentFactor: vine.number().range([0.1, 3]),
    proteinFactorPerKg: vine.number().range([0.1, 10]),
  })
