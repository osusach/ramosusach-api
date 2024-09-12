import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { errorMessage, course, teacher } from '../../shared/types'
import { sqlClient } from '../../utils/sqlClient'
import { getSectionsRoute } from './getSectionsRoute'
import { getSections } from '../application/getSections'
const sectionsApp = new OpenAPIHono<{Bindings: Bindings}>()


sectionsApp.openapi(getSectionsRoute, async (c) => {
  const db = sqlClient(c.env);
  const {course_id, career_id, period, page_size, page} = c.req.valid('query')
  const teachers = await getSections(course_id, career_id, period, page_size, page, db);
  
  return c.json(teachers.body, teachers.status)
})

export default sectionsApp;