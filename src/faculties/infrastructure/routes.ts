import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { getFaculties } from '../application/getFaculties'
import { sqlClient } from '../../utils/sqlClient'
import { getFacultiesRoute } from './getFacultiesRoute'

const facultyApp = new OpenAPIHono<{Bindings: Bindings}>()



facultyApp.openapi(getFacultiesRoute, async (c) => {
  const db = sqlClient(c.env);
  const faculties = await getFaculties(db);
  
  return c.json(faculties.body, faculties.status)
})


export default facultyApp;