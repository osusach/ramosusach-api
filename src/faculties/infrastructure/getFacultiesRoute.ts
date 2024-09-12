import { createRoute } from "@hono/zod-openapi"
import { faculty, errorMessage } from "../../shared/types"


export const getFacultiesRoute = createRoute({
  method: 'get',
  path: '',
  responses: {
    200: {
      content: {
        "application/json": {
          schema: faculty.array()
        }
      },

      description: "Obtains all faculties available"
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