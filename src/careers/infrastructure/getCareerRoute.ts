import { z } from "@hono/zod-openapi"
import { createRoute } from "@hono/zod-openapi"
import { career_with_courses } from "../application/getCareer"
import { errorMessage } from "../../shared/types"
import { commonResponses } from "../../shared/commonResponses"
const paramsSchema = z.object({
  career_id: z.coerce.number().openapi({
    param: {
      name: "career_id",
      in: "path",
      required: true,
      description: "Id of the career you want to search"
    },
    example: 1463
  })
})

export const getCareerRoute = createRoute({
  method: 'get',
  path: '/{career_id}',
  request: {
    params: paramsSchema
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: career_with_courses
        }
      },
      description: "Information about the career, with the courses it has"
    },
    ... commonResponses
  }
})