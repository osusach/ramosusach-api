import { z } from "@hono/zod-openapi"
import { createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { career_with_courses } from "../application/getCareer"
import { errorMessage } from "../../shared/types"
import { careerToToggle } from "../application/toggleCareers"


const example = [{section_id: 4013, is_active: false} ]




const headersSchema = z.object({
  
  Authorization: z.string().openapi({
    
    param: {
      name: "Authorization",
      in: "header",
      required: false,
      description: "JSON Web Token of the user. For example: Bearer YOUR_TOKEN"
    }
  })
})

const bodySchema = z.object({
  careers: careerToToggle.array().openapi({
    param: {
      name: 'careers',
      required: true,
      description: "An array of the id of the careers you want to toggle and is_active value",
      example: [{career_id: 4123, is_active: true}]
    },
  })
})

export const toggleCareersRoute = createRoute({
  method: 'post',
  path: '/toggle',
  security: [{ ['bearerAuth']: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: bodySchema
        }
      }
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: career_with_courses
        }
      },
      description: "Toggles the careers between is_active = true and is_active = false. Admin use only"
    },
    500: {
      content: {
        "application/json": {
          schema: errorMessage
        }
      },
      description: "Internal server error"
    }
  }
})