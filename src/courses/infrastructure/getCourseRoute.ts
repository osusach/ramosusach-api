import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { course, errorMessage } from "../../shared/types";
import { full_course } from "../application/getCourse";

const paramsSchema = z.object({
  course_id: z.coerce.number().openapi({
    param: {
      name: "course_id",
      in: "path",
      required: false,
      description: "id of the course you want to search",
    },
    example: 13303,
  }),
});

export const getCourseRoute = createRoute({
  method: "get",
  path: "/{course_id}",
  request: {
    params: paramsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            course: full_course,
          }),
        },
      },

      description: "Obtains info about the course asked",
    },
    500: {
      content: {
        "application/json": {
          schema: errorMessage,
        },
      },
      description: "Internal server error",
    },
  },
});
