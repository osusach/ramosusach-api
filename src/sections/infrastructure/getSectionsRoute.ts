import { z } from "@hono/zod-openapi"
import { createRoute } from "@hono/zod-openapi"
import { errorMessage, section, teacher } from "../../shared/types"
import { section_with_teachers } from "../application/getSections"
import { commonResponses } from "../../shared/commonResponses"

const paramsSchema = z.object({
  course_id: z.coerce.number().optional().openapi({
    param: {
      name: "course_id",
      in: "query",
      required: false,
      description: "id of the course the sections are from",
    },
    example: 13303
  }),
  career_id: z.coerce.number().optional().openapi({
    param: {
      name: "career_id",
      in: "query",
      required: false,
      description: "id of the career the sections are present"
    },
    example: 1463
  }),
  period: z.string().optional().openapi({
    param: {
      name: "period",
      in: "query",
      required: false,
      description: "The period (or semester) the sections are from"
    },
    example: "2024-02"
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

export const getSectionsRoute = createRoute({
  method: 'get',
  path: '',
  request: {
    query: paramsSchema
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: section_with_teachers.array()
        }
      },

      description: "Obtains all sections available"
    },
    ... commonResponses
  }

})