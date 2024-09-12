import { Client } from "@libsql/client";
import { course } from "../../shared/types";
import { dbQuery } from "../../utils/dbQuery";

export async function getCourses(
  career_id: number | undefined,
  pageSize: number | undefined,
  page: number | undefined,
  db: Client
): Promise<{ body: any; status: 200 | 500 }> {
  let query = "SELECT * FROM course WHERE is_active = 0";

  if (career_id != undefined) {
    query = `SELECT C.* FROM course C INNER JOIN career_course CC ON CC.course_id = C.id WHERE C.is_active = 0 AND CC.career_id = ${career_id}`;
  }

  if (page != undefined && pageSize != undefined) {
    query += ` LIMIT ${pageSize} OFFSET ${page * pageSize};`;
  }

  const courses = await dbQuery(query, course, db);
  if (!courses.success) {
    console.log(courses.error);
    return {
      status: 500,
      body: {
        message: "Error obteniendo los cursos desde la base de datos",
      },
    };
  }

  return {
    status: 200,
    body: {
      courses: courses.data,
    },
  };
}
