import { Client, ResultSet } from "@libsql/client";
import { validateJWT } from "../../shared/validateJWT";
import { dbQuery } from "../../utils/dbQuery";
import { course_comment_vote } from "../../shared/types";
import { z } from "@hono/zod-openapi";

export const comment_vote = z.object({
  comment_id: z.number(),
  vote: z.number().min(-1).max(1),
});

type comment_vote = z.infer<typeof comment_vote>;

export async function voteComment(
  comment_vote: comment_vote,
  header: string | undefined,
  env: Bindings,
  db: Client
): Promise<{body: any, status: 200 | 500}>  {
  const validation = await validateJWT(header, env);
  if (!validation.is_valid) {
    return {
      body: {
        message: "Send a valid jwt",
      },
      status: 500,
    };
  }

  const userData = validation.data;

  const previousVoteQuery = `SELECT * FROM course_comment_vote WHERE comment_id = ${comment_vote.comment_id} AND user_id = ${userData.id};`;
  const previousVote = await dbQuery(previousVoteQuery, course_comment_vote, db);
  if (!previousVote.success) {
    return {
      body: {
        message: "Error while trying to vote for comment",
      },
      status: 500,
    };
  }

  const hasVoted = previousVote.data.length > 0 ? true: false;
  const vote_update = await updateVote(comment_vote, userData.id, hasVoted, db)

  if (!vote_update.success) {
    return {
      body: {
        message: "Error while trying to vote for comment",
      },
      status: 500,
    }
  }
  let update_comment: {success: boolean}
  if (hasVoted) {
    update_comment = await updateCommentStats(previousVote.data[0], comment_vote, db)
  } else {
    update_comment = await updateCommentStats(null, comment_vote, db)
  }

  if (!update_comment.success) {
    return {
      body: {
        message: "Error while trying to vote for comment",
      },
      status: 500,
    }
  }

  return {
    body: null,
    status: 200
  }

}

async function updateVote(
  comment_vote: comment_vote,
  user_id: number,
  has_voted: boolean,
  db: Client
) {
  if (!has_voted && comment_vote.vote === 0) {
    return {
      success: true
    }
  }

  if (has_voted && comment_vote.vote === 0) {
    const voteQuery = `DELETE FROM course_comment_vote WHERE comment_id = ? AND user_id = ?`;
    const res = await db.execute({
      sql: voteQuery,
      args: [comment_vote.comment_id, user_id],
    });
    
    return {
      success: true
    }
  }

  const isUpvote = comment_vote.vote === 1? true: false;
  const voteQuery = `INSERT OR REPLACE INTO course_comment_vote (comment_id, user_id, is_upvote) VALUES (?, ?, ?)`;
  const res = await db.execute({
    sql: voteQuery,
    args: [comment_vote.comment_id, user_id, isUpvote],
  });
  
  return {
    success: true
  }
};



async function updateCommentStats(previous_vote: z.infer<typeof course_comment_vote> | null, current_vote: comment_vote, db: Client) {
  let change: number;
  if (!previous_vote) {
    change = current_vote.vote
  } else  {
    const prev = previous_vote.is_upvote ? 1: -1
    change = -(prev - current_vote.vote)
  }

  const updateQuery = "UPDATE course_comment SET upvotes = upvotes + ? WHERE id = ?;"
  const res = await db.execute({
    sql: updateQuery,
    args: [change, current_vote.comment_id]
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

// previous_vote = current_vote + change