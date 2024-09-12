import { z } from "@hono/zod-openapi"
import { createRoute } from "@hono/zod-openapi"
import { errorMessage } from "../../shared/types"
import { incomplete_comment } from "../application/commentCourse"
import { comment_vote } from "../application/voteComment"


export const voteCommentRoute = createRoute({
  method: 'post',
  path: '/vote',
  request: {
    body: {
      content: {
        'application/json': {
          schema: comment_vote
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

      description: "Votes on a comment"
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