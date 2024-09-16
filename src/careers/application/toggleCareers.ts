import { z } from "@hono/zod-openapi"
import { Client } from "@libsql/client"
import { applicationResponse, career } from "../../shared/types"
import { dbQuery } from "../../utils/dbQuery"


export const careerToToggle = z.object({
  career_id: z.number(),
  is_active: z.coerce.boolean()
})

type careerToToggle = z.infer<typeof careerToToggle>

export async function toggleCareers(careers: careerToToggle[], db: Client): Promise<applicationResponse> {
  const careersToActivate = careers.filter(e => e.is_active === true)
  const careersToDeactivate = careers.filter(e => e.is_active === false)
  try {
    if (careersToActivate.length > 0) {
      const activateIds = `(${careersToActivate.map(e => e.career_id).join(", ")})`
      const activateQuery = [`UPDATE career SET is_active = 1 WHERE id IN ${activateIds};`,
                             `UPDATE course SET is_active = 1 WHERE id IN (SELECT course_id FROM career_course WHERE career_id IN ${activateIds})`]
      const activation = await db.batch(activateQuery)
  
    }
  
    if (careersToDeactivate.length > 0) {
      const deactivateIds = `(${careersToDeactivate.map(e => e.career_id).join(", ")})`
      const deactivateQuery = [`UPDATE career SET is_active = 0 WHERE id IN ${deactivateIds};`,
                             `UPDATE course SET is_active = 0 WHERE id IN (SELECT course_id FROM career_course WHERE career_id IN ${deactivateIds})`]
      const deactivation = await db.batch(deactivateQuery)
    }
  }

  catch (e) {
    return {
      status: 500,
      body: {
        message: "Error while trying to update the careers"
      }
    }
  }

  const ids = `(${careers.map(e => e.career_id).join(", ")})`
  const updatedCareersQuery = `SELECT * FROM course WHERE id IN ${ids}`
  const updatedCareers = await dbQuery(updatedCareersQuery, career, db);

  if (!updatedCareers.success) {
    return {
      status: 500,
      body: {
        message: "Error while obtaining the updated careers"
      }
    }
  }

  return {
    status: 200,
    body: {
      careers: updatedCareers
    }
  }
  
}