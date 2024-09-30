import { Client } from "@libsql/client";
import { validateJWT } from "../../shared/validateJWT";
import { z } from "@hono/zod-openapi";
import { dbQuery } from "../../utils/dbQuery";
import { course, applicationResponse, course_vote } from "../../shared/types";

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
  
  const previous_vote_query = `SELECT * FROM course_vote WHERE course_id = ${vote.course_id} AND user_id = ${userData.id};`
  const previous_vote = await dbQuery(previous_vote_query, course_vote, db)
  if (!previous_vote.success) {
    return {
      body: {
        message: "Error while trying to retrieve the previous vote from database"
      },
      status: 500
    }
  }

  const getMeanQuery = `SELECT * FROM course WHERE id = ${vote.course_id}`
  const currentMean = await dbQuery(getMeanQuery, course, db)
  if (!currentMean.success || currentMean.data.length === 0) {
    return {
      body: {
        message: "Error trying to retrieve previous votes from the database"
      },
      status: 500
    }
  }
  const vote_update = await updateVote(vote, userData.id, db);
  if (!vote_update.success) {
    return {
      body: {
        message: "Error trying to insert vote from user"
      },
      status: 500
    }
  }

  let stats_update: { success: boolean}
  if (previous_vote.data.length > 0) {
    stats_update = await updateCourseStats(previous_vote.data[0], vote, userData.id, currentMean.data[0], db)
  } else {
    stats_update = await updateCourseStats(null, vote, userData.id, currentMean.data[0], db)
  }

  if (!stats_update.success) {
    return {
      body: {
        message: "Error updating the course stats in the database"
      },
      status: 500
    }
  }


  return {
    body: null,
    status: 200
  }
}

async function updateCourseStats(previous_vote: z.infer<typeof course_vote> | null, current_vote: vote, user_id: number, course_stats: z.infer<typeof course>, db: Client) {
  let difficulty_change: number;
  let time_change: number;
  let vote_change: number;
  if (!previous_vote) {
    difficulty_change = current_vote.difficulty_score
    time_change = current_vote.time_demand_score
    vote_change = 1
  } else  {
    difficulty_change = current_vote.difficulty_score - previous_vote.difficulty_score
    time_change = current_vote.time_demand_score - previous_vote.time_demand_score
    vote_change = 0
  }

  const new_difficulty_mean = ((course_stats.difficulty_mean * course_stats.vote_count) + difficulty_change) / (course_stats.vote_count + vote_change)
  const new_time_mean = ((course_stats.time_demand_mean * course_stats.vote_count) + time_change) / (course_stats.vote_count + vote_change)


  const updateQuery = `UPDATE course SET difficulty_mean = ?, time_demand_mean = ?, vote_count = vote_count + ? WHERE id = ?;`
  const res = await db.execute({
    sql: updateQuery,
    args: [new_difficulty_mean, new_time_mean, vote_change, current_vote.course_id]
  })

  if (res.rowsAffected != 1) {
    return {
      success: false
    }
  }
  return {
    success: true
  }
}


async function updateVote(current_vote: vote, user_id: number, db: Client) {
  const query = `INSERT OR REPLACE INTO course_vote (course_id, user_id, difficulty_score, time_demand_score) VALUES (${current_vote.course_id}, ${user_id}, ${current_vote.difficulty_score}, ${current_vote.time_demand_score});`
  const res = await db.execute(query)
  if (res.rowsAffected != 1) {
    return {
      success: false
    }
  }
  return {
    success: true
  }
}
