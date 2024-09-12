


import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { errorMessage, course, teacher } from '../../shared/types'
import { sqlClient } from '../../utils/sqlClient'
import { loginRoute } from './loginRoute'
import { login } from '../application/login'

const usersApp = new OpenAPIHono<{Bindings: Bindings}>()


usersApp.openapi(loginRoute, async (c) => {
  const db = sqlClient(c.env);
  const token = c.req.header('Authorization')
  console.log(token)
  const response = await login(token, c.env, db);
  
  return c.json(response.body, response.status)
})



export default usersApp;