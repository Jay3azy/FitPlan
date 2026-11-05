import vine from '@vinejs/vine'

export const createConditionValidator = vine.create({
  code: vine.string().trim().maxLength(20).unique({ table: 'conditions', column: 'code' }),
  name: vine.string().trim().maxLength(50),
  description: vine.string().trim().maxLength(200).optional(),
  maxSodiumMg: vine.number().positive().optional(),
  maxPurinesMg: vine.number().positive().optional(),
})

export const updateConditionValidator = (conditionId: number) =>
  vine.create({
    code: vine
      .string()
      .trim()
      .maxLength(20)
      .unique({ table: 'conditions', column: 'code', filter: (db) => { db.whereNot('id', conditionId) } }),
    name: vine.string().trim().maxLength(50),
    description: vine.string().trim().maxLength(200).optional(),
    maxSodiumMg: vine.number().positive().optional(),
    maxPurinesMg: vine.number().positive().optional(),
  })
