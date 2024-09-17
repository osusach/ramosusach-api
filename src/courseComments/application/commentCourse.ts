import { Client } from "@libsql/client"
import { z } from "@hono/zod-openapi"
import { validateJWT } from "../../shared/validateJWT"
import { applicationResponse } from "../../shared/types"

export const incomplete_comment = z.object({
  course_id: z.number(),
  parent_id: z.number().nullable(),
  content: z.string()
})

type incomplete_comment = z.infer<typeof incomplete_comment>


export async function commentCourse(comment: incomplete_comment, header: string | undefined, env: Bindings, db: Client): Promise<applicationResponse> {
  const validation = await validateJWT(header, env)
  if (!validation.is_valid) {
    return {
      body: {
        message: "Send a valid jwt"
      },
      // Gotta change
      status: 500
    }
  }
  const user_data = validation.data

  const query = `INSERT INTO course_comment (course_id, user_id, parent_id, content) VALUES (?, ?, ?, ?);`
  const res = await db.execute({sql: query,
    args: [comment.course_id, user_data.id, comment.parent_id, comment.content]
  })
  if (res.rowsAffected != 1) {
    return {
      body: {
        message: "Error while trying to store comment in database"
      },
      status: 500
    }
  }

  return {
    body: null,
    status: 201
  }
}