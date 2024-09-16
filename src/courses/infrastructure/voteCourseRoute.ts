import { z } from "@hono/zod-openapi"
import { createRoute } from "@hono/zod-openapi"
import { errorMessage } from "../../shared/types"
import { voteBody } from "../application/voteCourse"
import { commonResponses } from "../../shared/commonResponses"


export const voteCourseRoute = createRoute({
  method: 'post',
  path: '/vote',
  request: {
    body: {
      content: {
        'application/json': {
          schema: voteBody
        }      
      }
    }
  },
  security: [{['bearerAuth']: []}],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.null()
        }
      },

      description: "Sends a vote for the course"
    },
    ... commonResponses
  }

})