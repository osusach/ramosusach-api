import { Client } from "@libsql/client";
import { career, teacher } from "../../shared/types";
import { dbQuery } from "../../utils/dbQuery";




export async function getTeachers(course_id: number | undefined, page_size: number | undefined, page: number | undefined, db: Client): Promise<{body: any, status: 200 | 500}> {
  let query = "SELECT * FROM teacher"
  if (course_id != undefined) {
    query = `SELECT T.* FROM ((section S INNER JOIN teacher_section TS ON TS.section_id = S.id) INNER JOIN teacher T ON T.id = TS.teacher_id) WHERE S.course_id = ${course_id}`
  }

  page = page ? page : 0
  page_size = page_size ? page_size : 20
  
  query += ` LIMIT ${page_size} OFFSET ${page * page_size};`

  
  const teachers = await dbQuery(query, teacher, db)
  if (!teachers.success) {
    console.log(query)
    console.log(teachers.error)
    return {
      status: 500,
      body: {
        message: 
          "Error obteniendo los profesores desde la base de datos"
      }
    }
  }

  return {
    status: 200,
    body: {
      teachers: teachers.data
    }
  }
  
}