import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { errorMessage, course, teacher } from '../../shared/types'
import { sqlClient } from '../../utils/sqlClient'
import { getTeacher } from '../application/getTeacher'
import { getTeachers } from '../application/getTeachers'
import { getTeacherRoute } from './getTeacherRoute'
import { getTeachersRoute } from './getTeachersRoute'
const teachersApp = new OpenAPIHono<{Bindings: Bindings}>()


teachersApp.openapi(getTeachersRoute, async (c) => {
  const db = sqlClient(c.env);
  const {course_id, page_size, page} = c.req.valid('query')
  const teachers = await getTeachers(course_id, page_size, page, db);
  
  return c.json(teachers.body, teachers.status)
})

teachersApp.openapi(getTeacherRoute, async (c) => {
  const db = sqlClient(c.env);
  const { teacher_id } = c.req.valid('param')
  const teachers = await getTeacher(teacher_id, db);
  
  return c.json(teachers.body, teachers.status)
})


export default teachersApp;