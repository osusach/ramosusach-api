import { Client } from "@libsql/client";
import { validateJWT } from "../../shared/validateJWT";
import { dbQuery } from "../../utils/dbQuery";
import { course_vote } from "../../shared/types";



export async function canVote(token: string | undefined, course_id: number, env: Bindings, db: Client): Promise<{body: any, status: 200 | 500}> {
  const validation = await validateJWT(token, env)
  if (!validation.is_valid) {
    return {
      body: {
        message: "You must send a valid token"
      },
      status: 500
    }
  }

  const userData = validation.data

  const canVoteQuery = `SELECT * FROM course_vote WHERE course_id = ${course_id} AND user_id = ${userData.id};`
  const canVote = await dbQuery(canVoteQuery, course_vote, db)
  if (!canVote.success) {
    return {
      body: {
        message: "Error while trying to access database"
      },
      status: 500
    }
  }
  if (canVote.data.length != 0) {
    return {
      body: {
        can_vote: false
      },
      status: 200
    }
  }
  return {
    body: {
      can_vote: true
    },
    status: 200
  }




}