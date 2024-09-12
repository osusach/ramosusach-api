import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { errorMessage, course } from "../../shared/types";
import { sqlClient } from "../../utils/sqlClient";
import { getCourses } from "../application/getCourses";
import { getCoursesRoute } from "./getCoursesRoute";
import { getCourseRoute } from "./getCourseRoute";
import { getCourse } from "../application/getCourse";
import { canVoteRoute } from "./canVoteRoute";
import { voteCourseRoute } from "./voteCourseRoute";
import { canVote } from "../application/canVote";
import { voteCourse } from "../application/voteCourse";

const coursesApp = new OpenAPIHono<{ Bindings: Bindings }>();

coursesApp.openapi(getCoursesRoute, async (c) => {
  const db = sqlClient(c.env);
  const { career_id, page_size, page } = c.req.valid("query");
  const courses = await getCourses(career_id, page_size, page, db);

  return c.json(courses.body, courses.status);
});

coursesApp.openapi(getCourseRoute, async (c) => {
  const db = sqlClient(c.env);
  const { course_id } = c.req.valid("param");
  const course = await getCourse(course_id, db);
  return c.json(course.body, course.status);
});

coursesApp.openapi(canVoteRoute, async (c) => {
  const db = sqlClient(c.env);
  const token = c.req.header('Authorization')
  const { course_id } = c.req.valid('param')
  const teachers = await canVote(token, course_id, c.env, db);
  
  return c.json(teachers.body, teachers.status)
})

coursesApp.openapi(voteCourseRoute, async (c) => {
  const db = sqlClient(c.env)
  const token = c.req.header('Authorization')
  const vote = c.req.valid('json')
  const response = await voteCourse(token, vote, c.env, db)
  return c.json(response.body, response.status)
})

export default coursesApp;
