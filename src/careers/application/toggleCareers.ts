import { z } from "@hono/zod-openapi"
import { Client } from "@libsql/client"



export const careerToToggle = z.object({
  career_id: z.number(),
  is_active: z.boolean()
})

type careerToToggle = z.infer<typeof careerToToggle>

export async function toggleCareers(careers: careerToToggle[], db: Client): Promise<{body: any, status: 200 | 500}> {
  try {
    const careersToActivate = careers.filter(e => e.is_active === true)
    const careersToDeactivate = careers.filter(e => e.is_active === false)
  
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

  


  return {
    status: 200,
    body: {
      success: true
    }
  }
  
}