import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { errorMessage } from "../../shared/types";
import { incomplete_comment } from "../application/commentCourse";

const paramsSchema = z.object({
  course_id: z.coerce.number().openapi({
    param: {
      name: "course_id",
      in: "query",
      required: true,
      description: "id of the course the comments are for",
    },
    example: 13303,
  }),
  parent_id: z.coerce.number().optional().openapi({
    param: {
      name: "parent_id",
      in: "query",
      required: false,
      description: "Id of the parent comment, in order to get the replies of the comment",
    },
    example: 10,
  }),
  page: z.coerce.number().openapi({
    param: {
      name: "page",
      in: "query",
      required: true,
      description: "Number of page being accessed starting from 0 (zero)",
    },
    example: 0,
  }),
  page_size: z.coerce
    .number()
    .min(1)
    .openapi({
      param: {
        name: "page_size",
        in: "query",
        required: true,
        description:
          "Number of elements accessed in every page, starting from 1 (one)",
      },
      example: 10,
    }),
});

export const getCourseCommentsRoute = createRoute({
  method: "get",
  path: "",
  request: {
    query: paramsSchema,
  },
  security: [{ ["bearerAuth"]: [] }],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.null(),
        },
      },

      description: "Obtains comments from a course or replies from a comment",
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