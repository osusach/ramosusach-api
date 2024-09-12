import { z } from "@hono/zod-openapi"
import { createRoute } from "@hono/zod-openapi"
import { errorMessage } from "../../shared/types"
import { incomplete_comment } from "../application/commentCourse"


export const commentCourseRoute = createRoute({
  method: 'post',
  path: '',
  request: {
    body: {
      content: {
        'application/json': {
          schema: incomplete_comment
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

      description: "Uploads a comment on a course"
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