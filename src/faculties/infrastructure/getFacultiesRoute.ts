import { createRoute } from "@hono/zod-openapi"
import { faculty, errorMessage } from "../../shared/types"
import { commonResponses } from "../../shared/commonResponses"


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
    ... commonResponses
  }

})