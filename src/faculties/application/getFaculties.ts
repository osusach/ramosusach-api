import { Client } from "@libsql/client";
import { faculty, applicationResponse } from "../../shared/types";
import { dbQuery } from "../../utils/dbQuery";
import { STATUS_CODES } from "http";
import { StatusCode } from "hono/utils/http-status";

const query = "SELECT * FROM faculty WHERE is_active = TRUE"

export async function getFaculties(db: Client): Promise<applicationResponse> {
  const faculties = await dbQuery(query, faculty, db)
  if (!faculties.success) {
    return {
      status: 500,
      body: {
        message: 
          "Error obteniendo las facultades desde la base de datos"
      }
    }
  }

  return {
    status: 200,
    body: {
      faculties: faculties.data
    }
  }
  
}