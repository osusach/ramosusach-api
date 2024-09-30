
import { Client } from "@libsql/client";
import { applicationResponse, course_comment } from "../../shared/types";
import { validateJWT } from "../../shared/validateJWT";
import { dbQuery } from "../../utils/dbQuery";


export async function deleteComment(comment_id: number, auth: string | undefined, env: Bindings, db: Client): Promise<applicationResponse> {
  const validation = await validateJWT(auth, env)
  if (!validation.is_valid) {
    return {
      body: {
        message: "Send a valid jwt"
      },
      // Gotta change
      status: 500
    }
  }

  const user_id = validation.data.id

  const query = `SELECT * FROM course_comment WHERE id = ${comment_id};`
  const comment_res = await dbQuery(query, course_comment, db);
  if (!comment_res.success) {
    return {
      body: {
        message: "Error getting comment from database"
      },
      status: 500
    }
  }

  if (comment_res.data.length === 0) {
    return {
      body: {
        message: "The comment does not exist"
      },
      status: 404
    }
  }

  const comment = comment_res.data[0]
  if (comment.user_id !== user_id) {
    return {
      body: null,
      status: 403
    }
  }

  const delete_query = `DELETE FROM course_comment WHERE id = ${comment_id};`
  try {
    await db.execute(delete_query)
  } catch {
    return {
      body: {
        message: "Error deleting the comment from the db"
      },
      status: 500
    }
  }
  
  
  return {
    body: null,
    status: 204
  }
}