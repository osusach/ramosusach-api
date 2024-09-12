import { Client } from "@libsql/client";
import { dbQuery } from "../../utils/dbQuery";
import { z } from "@hono/zod-openapi";
import { course } from "../../shared/types";

export const stats_schema = z.object({
  course_id: z.number(),
  score: z.number(),
  votes: z.number(),
});

const stat_schema = z.object({
  score: z.number(),
  votes: z.number(),
});

export const full_course = course.and(
  z.object({
    votes: z.object({
      difficulty_stats: stat_schema.array(),
      time_demand_stats: stat_schema.array(),
    }),
  })
);

export async function getCourse(
  course_id: number,
  db: Client
): Promise<{ body: any; status: 200 | 500 }> {
  const difficulty_query = `SELECT course_id, difficulty_score score, count(difficulty_score) as votes FROM course_vote WHERE course_id = ${course_id} GROUP BY course_id, difficulty_score ORDER BY difficulty_score ASC;`;
  const time_query = `SELECT course_id, time_demand_score score, count(time_demand_score) as votes FROM course_vote WHERE course_id = ${course_id} GROUP BY course_id, time_demand_score ORDER BY time_demand_score`;

  const difficulty = await dbQuery(difficulty_query, stats_schema, db);
  if (!difficulty.success) {
    return {
      body: {
        message: "Error getting course stats from the db",
      },
      status: 500,
    };
  }

  const time_demand = await dbQuery(time_query, stats_schema, db);
  if (!time_demand.success) {
    return {
      body: {
        message: "Error getting course stats from db",
      },
      status: 500,
    };
  }

  const courseQuery = `SELECT * FROM course WHERE id = ${course_id}`;
  const course_response = await dbQuery(courseQuery, course, db);
  if (!course_response.success) {
    console.log(course_response.error);
    return {
      body: {
        message: "Error getting course from the db",
      },
      status: 500,
    };
  }

  return {
    body: {
      course: {
        ...course_response.data[0],
        votes: {
          difficulty_stats: fixStats(difficulty.data),
          time_demand_stats: fixStats(time_demand.data),
        },
      },
    },
    status: 200,
  };
}

function fixStats(obtained_stats: z.infer<typeof stats_schema>[]) {
  const stats = [
    { score: 1, count: 0 },
    { score: 2, count: 0 },
    { score: 3, count: 0 },
    { score: 4, count: 0 },
    { score: 5, count: 0 },
  ];

  return stats.map((stat) => {
    const matching_score = obtained_stats.find((e) => e.score === stat.score);
    const new_count = matching_score ? matching_score.votes : 0;
    return { score: stat.score, count: new_count };
  });
}
