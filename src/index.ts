import { Hono } from 'hono'
import { OpenAPIHono } from '@hono/zod-openapi'
import facultyApp from './faculties/infrastructure/routes'
import { swaggerUI } from '@hono/swagger-ui'
import careerApp from './careers/infrastructure/routes'
import coursesApp from './courses/infrastructure/routes'
import teachersApp from './teachers/infrastructure/routes'
import sectionsApp from './sections/infrastructure/routes'
import usersApp from './users/infrastructure/routes'
import { cors } from 'hono/cors'
import courseCommentsApp from './courseComments/infrastructure/routes'
const app = new OpenAPIHono()
const registry = careerApp.openAPIRegistry
app.use(cors())
registry.registerComponent('securitySchemes', 'googleAuth', {
  type: 'http',
  scheme: 'bearer',
  'bearerFormat': 'JWT',
  in: 'header',
  description: "JWT obtained from a Google Log In button with the proper GOOGLE_CLIENT_ID"
})

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  'bearerFormat': 'JWT',
  in: 'header',
  description: "Custom JWT provided by the ramosusach api"
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.route('/faculties', facultyApp)
app.route('/careers', careerApp)
app.route('/courses', coursesApp)
app.route('/teachers', teachersApp)
app.route('/sections', sectionsApp)
app.route('/users', usersApp)
app.route('/courseComments', courseCommentsApp)

app.get('/ui', swaggerUI({url: '/doc'}))

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '0.5.0',
    title: 'Ramos USACH',
  },
})

export default app
