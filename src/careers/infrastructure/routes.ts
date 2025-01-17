import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { errorMessage, faculty, career } from "../../shared/types";
import { getCareers } from "../application/getCareers";
import { sqlClient } from "../../utils/sqlClient";
import { getCareerRoute } from "./getCareerRoute";
import { getCareer } from "../application/getCareer";
import { getCareersRoute } from "./getCareersRoute";
import { toggleCareersRoute } from "./toggleCareerRoute";
import { toggleCareers } from "../application/toggleCareers";
import { validateJWT } from "../../shared/validateJWT";

const careerApp = new OpenAPIHono<{ Bindings: Bindings }>();

careerApp.openapi(getCareersRoute, async (c) => {
  const db = sqlClient(c.env);
  const { faculty_id, page_size, page } = c.req.valid("query");
  const faculties = await getCareers(faculty_id, page_size, page, db);

  return c.json(faculties.body, faculties.status)

});

careerApp.openapi(getCareerRoute, async (c) => {
  const db = sqlClient(c.env);
  const { career_id } = c.req.valid("param");
  const career = await getCareer(career_id, db);
  return c.json(career.body, career.status);

});

careerApp.openapi(toggleCareersRoute, async (c) => {
  const db = sqlClient(c.env);
  const { careers } = c.req.valid("json");
  const token = c.req.header("Authorization");
  const validation = await validateJWT(token, c.env);
  if (!validation.is_valid) {
    console.log("fail lol");
    // Gotta change this, but lucas is using it
    return c.json(null, 500);
  }
  if (!validation.data.is_admin) {
    console.log("fail 2 lol");
    console.log(JSON.stringify(validation.data));
    return c.json(null, 403);
  }

  console.log("success lol");
  const response = await toggleCareers(careers, db);
  return c.json(response.body, response.status);
});

export default careerApp;
