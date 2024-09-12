import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { errorMessage, course } from "../../shared/types";
import { sqlClient } from "../../utils/sqlClient";
import { commentCourseRoute } from "./commentCourseRoute";
import { commentCourse } from "../application/commentCourse";
import { getCourseCommentsRoute } from "./getCourseCommentsRoute";
import { getCourseComments } from "../application/getCourseComments";
import { voteCommentRoute } from "./voteCommentRoute";
import { voteComment } from "../application/voteComment";

const courseCommentsApp = new OpenAPIHono<{ Bindings: Bindings }>();

courseCommentsApp.openapi(commentCourseRoute, async (c) => {
  const db = sqlClient(c.env);
  const comment = c.req.valid("json");
  const authorization = c.req.header("Authorization");
  const courses = await commentCourse(comment, authorization, c.env, db);

  return c.json(courses.body, courses.status);
});

courseCommentsApp.openapi(getCourseCommentsRoute, async (c) => {
  const db = sqlClient(c.env);
  const { course_id, parent_id, page, page_size } = c.req.valid("query");
  const authorization = c.req.header("Authorization");
  const course = await getCourseComments(
    course_id,
    parent_id,
    page,
    page_size,
    authorization,
    c.env,
    db
  );
  return c.json(course.body, course.status);
});

courseCommentsApp.openapi(voteCommentRoute, async (c) => {
  const db = sqlClient(c.env);
  const token = c.req.header("Authorization");
  const vote = c.req.valid("json");
  const response = await voteComment(vote, token, c.env, db);
  return c.json(response.body, response.status);
});

export default courseCommentsApp;
