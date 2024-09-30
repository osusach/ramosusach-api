import { createRoute, z } from "@hono/zod-openapi"
import { commonResponses } from "../../shared/commonResponses"

const paramsSchema = z.object({
  comment_id: z.coerce.number().openapi({
    param: {
      name: "comment_id",
      in: "path",
      required: true,
      description: "id of the comment to delete",
    },
    example: 42,
  })
})

export const deleteCommentRoute = createRoute({
  method: 'delete',
  path: '/{comment_id}',
  request: {
    params: paramsSchema
  },
  security: [{['bearerAuth']: []}],
  responses: {
   ... commonResponses
  }

})