import { z } from "@hono/zod-openapi"
import { createRoute } from "@hono/zod-openapi"
import { section_with_course, teacher_with_courses } from "../application/getTeacher"
import { errorMessage } from "../../shared/types"
const paramsSchema = z.object({
  teacher_id: z.coerce.number().openapi({
    param: {
      name: "teacher_id",
      in: "path",
      required: true,
      description: "Id of the teacher you want to search"
    },
    example: 20
  })
})

export const getTeacherRoute = createRoute({
  method: 'get',
  path: '/{teacher_id}',
  request: {
    params: paramsSchema
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            teacher: teacher_with_courses
          })
        }
      },
      description: "Information about the teacher and the courses they impart"
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