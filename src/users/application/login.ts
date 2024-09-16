import { Client } from "@libsql/client";
import { googlePayload, validateGoogleJWT } from "../../utils/validateGoogleJWT";
import { applicationResponse, user } from "../../shared/types";
import { dbQuery } from "../../utils/dbQuery";
import { z } from "@hono/zod-openapi";
import { createJWT } from "../../utils/createJWT";


export const loginResponse = z.object({
  name: z.string(),
  profile_img: z.string(),
  token: z.string()
})
export async function login(token: string | undefined, env: Bindings, db: Client): Promise<applicationResponse> {
  if (token === undefined) {
    return {
      body: {
        message: "A jwt must be sent via the Authorization header"
      },
      status: 401
    }
  }

  const jwtValidation = await validateGoogleJWT(token, env, db)
  if (!jwtValidation.is_valid) {
    return {
      body: {
        message: "A valid jwt must be sent via the Authorization header"
      },
      // Gotta change
      status: 500
    }
  }

  const userData = jwtValidation.data

  const userQuery = `SELECT * FROM user WHERE sub = "${userData.sub}"`
  const retrievedUser = await dbQuery(userQuery, user, db)

  if (!retrievedUser.success) {
    return {
      body: {
        message: "Error while trying to find user in database"
      },
      status: 500
    }
  }

  let response: z.infer<typeof loginResponse>

  if (retrievedUser.data.length === 0) {
    const registration = await registerUser(userData, db)
    const token = await createJWT(registration, env)
    response = {
      profile_img: userData.picture,
      name: userData.name,
      token
    }
  } else {
    const token = await createJWT(retrievedUser.data[0],
    env)
    response = {
      profile_img: userData.picture,
      name: userData.name,
      token
    }
  }
  return {
    body: response,
    status: 200
  }





}




async function registerUser(userData: googlePayload, db: Client) {
  const addUserQuery = "INSERT INTO user (sub, name, profile_img, is_admin) VALUES (?, ?, ?, ?);"
  const result = await db.execute({
    sql: addUserQuery,
    args: [
      userData.sub,
      userData.name,
      userData.picture,
      false
    ]
  })

  return {
    id: Number(result.lastInsertRowid),
    is_admin: false,
    sub: userData.sub
  }

}