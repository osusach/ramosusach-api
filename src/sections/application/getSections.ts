import { Client } from "@libsql/client";
import { applicationResponse, course, section, teacher } from "../../shared/types";
import { dbQuery } from "../../utils/dbQuery";
import { z } from "@hono/zod-openapi";

const teacher_with_section_id = teacher.and(
  z.object({
    section_id: z.number(),
  })
);

export const section_with_teachers = section.and(
  z.object({
    teachers: teacher.array(),
  })
);

type secWithTeachers = z.infer<typeof section_with_teachers>;

export async function getSections(
  course_id: number | undefined,
  career_id: number | undefined,
  period: string | undefined,
  page_size: number | undefined,
  page: number | undefined,
  db: Client
): Promise<applicationResponse> {
  let query = `SELECT * FROM section S`;
  let constraints: string[] = [];

  if (career_id != undefined) {
    constraints.push(`CS.career_id = ${career_id}`);
    query = `SELECT S.* FROM section S INNER JOIN career_section CS ON CS.section_id = S.id`;
  }
  if (course_id != undefined) {
    constraints.push(`S.course_id = ${course_id}`);
  }

  if (period != undefined) {
    constraints.push(`S.period = "${period}"`);
  }

  if (constraints.length > 0) {
    query += ` WHERE ${constraints.join(" AND ")}`;
  }

  page = page ? page : 0;
  page_size = page_size ? page_size : 20;

  query += ` LIMIT ${page_size} OFFSET ${page * page_size};`;

  const sections = await dbQuery(query, section, db);
  if (!sections.success) {
    console.log(sections.error);
    console.log(query);
    return {
      status: 500,
      body: {
        message: "Error obteniendo las secciones desde la base de datos",
      },
    };
  }

  const sectionIds = sections.data.map((e) => e.id);

  const teachersQuery = `SELECT
                         TS.section_id section_id, T.*
                         FROM teacher T INNER JOIN teacher_section TS ON TS.teacher_id = T.id
                         WHERE TS.section_id IN (${sectionIds.join(", ")})`;
  const teachers = await dbQuery(teachersQuery, teacher_with_section_id, db);
  if (!teachers.success) {
    return {
      status: 500,
      body: {
        message:
          "Error obteniendo los profesores de las secciones desde la base de datos",
      },
    };
  }

  console.log(JSON.stringify(teachers.data));
  console.log(teachersQuery);
  const sectionsWithTeachers: secWithTeachers[] = [];
  for (let i = 0; i < sections.data.length; i++) {
    const section = sections.data[i];
    console.log(section.id);
    const section_teachers = teachers.data
      .filter((e) => e.section_id == section.id)
      .map((e) => {
        const { section_id, ...pureTeacher } = e;
        return pureTeacher;
      });
    sectionsWithTeachers.push({
      ...section,
      teachers: section_teachers,
    });
  }

  return {
    status: 200,
    body: {
      sections: sectionsWithTeachers,
    },
  };
}
