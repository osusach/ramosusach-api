import { Client } from "@libsql/client";
import { validateJWT } from "../../shared/validateJWT";
import { dbQuery } from "../../utils/dbQuery";
import { course_comment } from "../../shared/types";
import { z } from "@hono/zod-openapi";
import { applicationResponse } from "../../shared/types";

export const vote_checked_comment = course_comment.and(z.object({
  is_already_voted: z.coerce.boolean(),
  user_name: z.string(),
  user_profile_img: z.string()
}))

export async function getCourseComments(course_id: number, parent_id: number | undefined, page: number, page_size: number, token: string | undefined, env: Bindings, db: Client): Promise<applicationResponse> {
  const validation = await validateJWT(token, env)
  if (!validation.is_valid) {
    return {
      body: {
        message: "Send a valid jwt"
      },
      status: 500
    }
  }
  // user_id
  const { id } = validation.data

  

  let query = `SELECT CC.*, (CCV.id != NULL) as is_already_voted, U.name as user_name, U.profile_img as user_profile_img FROM (course_comment CC LEFT JOIN course_comment_vote CCV ON CCV.comment_id = CC.id AND CCV.user_id = ${id}) INNER JOIN user U ON U.id = CC.user_id WHERE course_id = ${course_id}`
  if (parent_id != undefined) {
    query += `AND parent_id = ${parent_id}`
  }
  query += `LIMIT ${page_size} OFFSET ${page_size * page};`
  const comments = await dbQuery(query, vote_checked_comment, db);
  if (!comments.success) {
    console.log(comments.error)
    return {
      body: {
        message: "Error obteniendo los comentarios desde la base de datos"
      },
      status: 500
    }
  }

  return {
    body: {
      comments: comments.data
    },
    status: 200
  }

}