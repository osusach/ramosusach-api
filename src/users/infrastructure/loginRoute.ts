import { z } from "@hono/zod-openapi"
import { createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { errorMessage } from "../../shared/types"
import { loginResponse } from "../application/login"
import { commonResponses } from "../../shared/commonResponses"




export const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  security: [{ ['googleAuth']: [] }],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: loginResponse
        }
      },
      description: "Logs into the app, using a google jwt to get a custom jwt for the app."
    },
    ... commonResponses
  }
})
