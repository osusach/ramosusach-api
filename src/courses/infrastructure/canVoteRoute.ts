import { z } from "@hono/zod-openapi"
import { createRoute } from "@hono/zod-openapi"
import { errorMessage } from "../../shared/types"
const paramsSchema = z.object({
  course_id: z.coerce.number().openapi({
    param: {
      name: "course_id",
      in: "path",
      required: true,
      description: "id of the course you want to check you can vote for",
    },
    example: 13303
  })

})

export const canVoteRoute = createRoute({
  method: 'get',
  path: '/can_vote/{course_id}',
  request: {
    params: paramsSchema
  },
  security: [{['bearerAuth']: []}],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            can_vote: z.boolean()
          })
        }
      },

      description: "Checks if the user can or can not vote for the course"
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