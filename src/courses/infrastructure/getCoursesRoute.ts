import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { course, errorMessage } from "../../shared/types";
import { commonResponses } from "../../shared/commonResponses";

const paramsSchema = z.object({
  career_id: z.coerce
    .number()
    .optional()
    .openapi({
      param: {
        name: "career_id",
        in: "query",
        required: false,
        description: "id of the career the courses are present",
      },
      example: 1463,
    }),
  page: z.coerce
    .number()
    .optional()
    .openapi({
      param: {
        name: "page",
        in: "query",
        required: false,
        description: "Number of page being accessed starting from 0 (zero)",
      },
      example: 0,
    }),
  page_size: z.coerce
    .number()
    .min(1)
    .max(200)
    .optional()
    .openapi({
      param: {
        name: "page_size",
        in: "query",
        required: false,
        description:
          "Number of elements accessed in every page, starting from 1 (one)",
      },
      example: 20,
    }),
});

export const getCoursesRoute = createRoute({
  method: "get",
  path: "",
  request: {
    query: paramsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            courses: course.array(),
          }),
        },
      },

      description: "Obtains all courses available",
    },
    ... commonResponses
  },
});
