import { Client } from "@libsql/client";
import { career, course, teacher } from "../../shared/types";
import { dbQuery } from "../../utils/dbQuery";
import { z } from "@hono/zod-openapi";

export const course_with_level = z.object({
  level: z.number()
}).and(course)

export const career_with_courses = career.and(z.object({
  courses: course_with_level.array()
}))



export async function getCareer(career_id: number, db: Client): Promise<{body: any, status: 200 | 500}> {
  
  const career_query = `SELECT * FROM career WHERE career.id = ${career_id}`

  const teachers = await dbQuery(career_query, career, db)
  if (!teachers.success) {
    return {
      status: 500,
      body: {
        message: 
          `Error obteniendo la carrera ${career_id} desde la base de datos`
      }
    }
  }
  const courses_query = `SELECT CC.level level, C.* FROM career_course CC INNER JOIN course C ON C.id = CC.course_id WHERE CC.career_id = ${career_id}`
  const courses = await dbQuery(courses_query, course_with_level, db)
  if (!courses.success) {
    console.log(courses.error)
    return {
      status: 500,
      body: {
        message: 
          "Error obteniendo los cursos de la carrera desde la base de datos"
      }
    }
  }

  return {
    status: 200,
    body: {
      careers: {
        ... teachers.data[0],
        imparted_courses: courses.data
      }
    }
  }
  
}