import { z } from "@hono/zod-openapi"
import { career, errorMessage } from "../../shared/types"
import { createRoute } from "@hono/zod-openapi"
import { commonResponses } from "../../shared/commonResponses"

const paramsSchema = z.object({
  faculty_id: z.coerce.number().optional().openapi({
    param: {
      name: "faculty_id",
      in: "query",
      required: false,
      description: "id of the faculty careers are from",
    },
    example: 40
  }),
  page: z.coerce.number().optional().openapi({
    param: {
      name: 'page',
      in: 'query',
      required: false,
      description: "Number of page being accessed starting from 0 (zero)",
    },
    example: 0
  }),
  page_size: z.coerce.number().min(1).optional().openapi({
    param: {
      name: 'page_size',
      in: 'query',
      required: false,
      description: "Number of elements accessed in every page, starting from 1 (one)",
    },
    example: 20,
    
  })

})

export const getCareersRoute = createRoute({
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
            careers: career.array()
          })
        }
      },

      description: "Obtains all careers available"
    },
    ... commonResponses
  }

})