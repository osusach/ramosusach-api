import { Client } from "@libsql/client";
import { z } from "@hono/zod-openapi";
import jwt from "@tsndr/cloudflare-worker-jwt"
import { jwtContents } from "./types";



type response = {
  is_valid: true,
  data: z.infer<typeof jwtContents>
} | {
  is_valid: false
}


export async function validateJWT(header: string | undefined, env: Bindings): Promise<response> {
  const token = parseToken(header)
  if (!token) {
    return {
      is_valid: false
    }
  }
  const verification = await jwt.verify(token, env.JWT_SECRET_KEY)
  if (!verification) {
    console.log('verification fail')
    return {
      is_valid: false
    }
  }
  const decoded = jwt.decode(token)
  const data = jwtContents.safeParse(decoded.payload)
  if (!data.success) {
    console.log(decoded)
    return {
      is_valid: false
    }
  }
  

  return {
    is_valid: true,
    data: data.data
  }
}

function parseToken(token: string | undefined) {
  if (token === undefined) {
    return null
  }

  const parts = token.split(" ")
  if (parts.length != 2) {
    return null
  }

  if (parts[0] != 'Bearer') {
    return null
  }

  return parts[1]

}

