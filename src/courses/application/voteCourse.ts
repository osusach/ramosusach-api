import { Client } from "@libsql/client";
import { validateJWT } from "../../shared/validateJWT";
import { z } from "@hono/zod-openapi";
import { dbQuery } from "../../utils/dbQuery";
import { course, applicationResponse } from "../../shared/types";

export const voteBody = z.object({
  course_id: z.number(),
  difficulty_score: z.number().min(1).max(5),
  time_demand_score: z.number().min(1).max(5)
})

type vote = z.infer<typeof voteBody>


export async function voteCourse(token: string | undefined, vote: vote, env: Bindings, db: Client): Promise<applicationResponse> {
  const validation = await validateJWT(token, env)
  if (!validation.is_valid) {
    return {
      body: {
        message: "You must send a valid jwt"
      },
      // Gotta change
      status: 500
    }
  }

  const userData = validation.data 

  
  const query = `INSERT OR REPLACE INTO course_vote (course_id, user_id, difficulty_score, time_demand_score) VALUES (${vote.course_id}, ${userData.id}, ${vote.difficulty_score}, ${vote.time_demand_score});`

  const single_vote = await db.execute(query)
  if (single_vote.rowsAffected != 1) {
    return {
      body: {
        message: "Error trying to store the vote in the database"
      },
      status: 500
    }
  }

  const getMeanQuery = `SELECT * FROM course WHERE id = ${vote.course_id}`
  const currentMean = await dbQuery(getMeanQuery, course, db)
  if (!currentMean.success || currentMean.data.length === 0) {
    return {
      body: {
        message: "Error trying to store the vote in the database"
      },
      status: 500
    }
  }

  let {vote_count, difficulty_mean, time_demand_mean } = currentMean.data[0]

  const new_difficulty_mean = ((difficulty_mean * vote_count) + vote.difficulty_score) / (vote_count + 1)
  const new_time_mean = ((time_demand_mean * vote_count) + vote.difficulty_score) / (vote_count + 1)
  const updateMeanQuery = `UPDATE course SET difficulty_mean = ${new_difficulty_mean}, time_demand_mean = ${new_time_mean} WHERE id = ${vote.course_id};`
  const result = await db.execute(updateMeanQuery)
  if (result.rowsAffected != 1) {
    return {
      body: {
        message: "Error while trying to update the scores"
      },
      status: 500
    }
  }

  return {
    body: null,
    status: 200
  }


}