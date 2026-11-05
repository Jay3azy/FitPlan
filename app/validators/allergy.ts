import vine from '@vinejs/vine'

export const createAllergyValidator = vine.create({
  code: vine.string().trim().maxLength(20).unique({ table: 'allergies', column: 'code' }),
  name: vine.string().trim().maxLength(50),
  description: vine.string().trim().maxLength(200).optional(),
})

export const updateAllergyValidator = (allergyId: number) =>
  vine.create({
    code: vine
      .string()
      .trim()
      .maxLength(20)
      .unique({ table: 'allergies', column: 'code', filter: (db) => { db.whereNot('id', allergyId) } }),
    name: vine.string().trim().maxLength(50),
    description: vine.string().trim().maxLength(200).optional(),
  })
