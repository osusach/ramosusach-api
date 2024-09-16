import { Client } from "@libsql/client";
import { applicationResponse, career } from "../../shared/types";
import { dbQuery } from "../../utils/dbQuery";


export async function getCareers(faculty_id: number | undefined, pageSize: number | undefined, page: number | undefined, db: Client): Promise<applicationResponse> {
  let query = "SELECT * FROM career WHERE is_active = 0"

  if (faculty_id) {
    query += ` AND faculty_id = ${faculty_id}`
  }


  if (page != undefined && pageSize != undefined) {
    query += ` LIMIT ${pageSize} OFFSET ${page * pageSize}`
  }


  
  const careers = await dbQuery(query, career, db)
  if (!careers.success) {
    return {
      status: 500,
      body: {
        message: 
          "Error obteniendo las carreras desde la base de datos"
      }
    }
  }

  return {
    status: 200,
    body: {
      careers: careers.data
    }
  }
  
}