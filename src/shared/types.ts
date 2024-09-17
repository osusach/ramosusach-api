

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

export const course = z.object({
  id: z.number(),
  name: z.string(),
  duration: z.string(),
  vote_count: z.number(),
  difficulty_mean: z.number(),
  time_demand_mean: z.number(),
  is_active: z.coerce.boolean(),
  creation_date: z.coerce.date(),
  modification_date: z.coerce.date()
})

export const teacher = z.object({
  id: z.number(),
  name: z.string(),
  vote_count: z.number(),
  strictness_mean: z.number(),
  pedagogical_skill_mean: z.number(),
  creation_date: z.coerce.date(),
  modification_date: z.coerce.date()
})

export const section = z.object({
  id: z.number(),
  code: z.string(),
  course_id: z.number(),
  course_type: z.string(),
  quota: z.number(),
  signed_up: z.number(),
  period: z.string(),
  schedule: z.string(),
  creation_date: z.coerce.date(),
  modification_date: z.coerce.date()
})

export const user = z.object({
  id: z.number(),
  sub: z.string(),
  name: z.string(),
  profile_img: z.string(),
  is_admin: z.coerce.boolean(),
  creation_date: z.coerce.date(),
  modification_date: z.coerce.date()
})


export const jwtContents = z.object({
  nbf: z.number(),
  exp: z.number(),
  iat: z.number(),
  iss: z.string(),
  aud: z.string().or(z.string().array()),
  id: z.number(),
  is_admin: z.coerce.boolean(),
  sub: z.string()
})

export const course_vote = z.object({
  id: z.number(),
  course_id: z.number(),
  user_id: z.number(),
  difficulty_score: z.number(),
  time_demand_score: z.number()
})


export const course_comment = z.object({
  id: z.number(),
  course_id: z.number(),
  user_id: z.number(),
  parent_id: z.number().nullable(),
  reply_count: z.number(),
  content: z.string(),
  upvotes: z.number(),
  creation_date: z.coerce.date(),
  modification_date: z.coerce.date()
})

export const course_comment_vote = z.object({
  id: z.number(),
  comment_id: z.number(),
  user_id: z.number(),
  is_upvote: z.coerce.boolean()
})


export const errorMessage = z.object({
  message: z.string()
})

export type applicationResponse = {
  status: typeof available_status_codes[number],
  body: any
} 
const available_status_codes = [
  200,
  201,
  204,
  304,
  400,
  401,
  403,
  404,
  500,
] as const

