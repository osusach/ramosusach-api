import { z } from '@hono/zod-openapi'


export const faculty = z.object( {
  id: z.number(),
  name: z.string(),
  is_active: z.coerce.boolean(),
  creation_date: z.coerce.date(),
  modification_date: z.coerce.date()
})

export const career = z.object({
  id: z.number(),
  name: z.string(),
  faculty_id: z.number(),
  is_active: z.coerce.boolean(),
  creation_date: z.coerce.date(),
  modification_date: z.coerce.date()
})

export const errorMessage = z.object( {
  message: z.string()
})


