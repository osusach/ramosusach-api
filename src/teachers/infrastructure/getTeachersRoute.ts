import { z } from "@hono/zod-openapi"
import { createRoute } from "@hono/zod-openapi"
import { errorMessage, teacher } from "../../shared/types"

const paramsSchema = z.object({
  course_id: z.coerce.number().optional().openapi({
    param: {
      name: "course_id",
      in: "query",
      required: false,
      description: "id of the course the teachers impart",
    },
    example: 13303
  }),
  page: z.coerce.number().optional().openapi({
    param: {
      name: 'page',
      in: 'query',
      required: true,
      description: "Number of page being accessed starting from 0 (zero)",
    },
    example: 0
  }),
  page_size: z.coerce.number().min(1).optional().openapi({
    param: {
      name: 'page_size',
      in: 'query',
      required: true,
      description: "Number of elements accessed in every page, starting from 1 (one)",
    },
    example: 20,
    
  })

})

export const getTeachersRoute = createRoute({
  method: 'get',
  path: '',
  request: {
    query: paramsSchema
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            teachers: teacher.array()
          })
        }
      },

      description: "Obtains all teachers available"
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