import { Client } from "@libsql/client";
import { career, course, teacher } from "../../shared/types";
import { dbQuery } from "../../utils/dbQuery";
import { z } from "@hono/zod-openapi";
export const section_with_course = z.object({
  section_id: z.number(),
  section_code: z.string()
}).and(course)

export const teacher_with_courses = teacher.and(z.object({
  imparted_courses: course.array()
}))



export async function getTeacher(teacher_id: number, db: Client): Promise<{body: any, status: 200 | 500}> {
  
  let query = "SELECT * FROM teacher"
  const teachers_query = `SELECT * FROM teacher WHERE teacher.id = ${teacher_id}`


  const teachers = await dbQuery(teachers_query, teacher, db)
  if (!teachers.success) {
    return {
      status: 500,
      body: {
        message: 
          "Error obteniendo los profesores desde la base de datos"
      }
    }
  }
  const imparted_courses_query = `SELECT TS.section_id section_id, S.code section_code, C.* FROM (((teacher_section TS INNER JOIN teacher T ON TS.teacher_id = T.id) INNER JOIN section S ON S.id = TS.section_id) INNER JOIN course C ON C.id = S.course_id) WHERE T.id = ${teacher_id};`
  const imparted_courses = await dbQuery(imparted_courses_query, section_with_course, db)
  if (!imparted_courses.success) {
    console.log(imparted_courses.error)
    return {
      status: 500,
      body: {
        message: 
          "Error obteniendo los cursos del profesor desde la base de datos"
      }
    }
  }

  return {
    status: 200,
    body: {
      teacher: {
        ... teachers.data[0],
        imparted_courses: imparted_courses.data
      }
    }
  }
  
}