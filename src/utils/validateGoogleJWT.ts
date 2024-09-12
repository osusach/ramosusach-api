import { Client } from "@libsql/client"
import jwt from "@tsndr/cloudflare-worker-jwt"

export interface googlePayload {
  iss: string,
  azp: string,
  aud: string,
  sub: string,
  hd: string,
  email: string,
  email_verified: boolean,
  nbf: number,
  name: string,
  picture: string,
  given_name: string,
  family_name: string,
  locale: string,
  iat: number,
  exp: number,
  jti: string
}

type user = {
  id: number,
  sub: string,
  profile_img: string,
  name: string,
}

type googleCert = {
  keys: JsonWebKey[]
}

const googleIss = [
  "accounts.google.com",
  "https://accounts.google.com"
]

type jwtContents = {
  id: number,
  is_admin: boolean,
}

type response = {
  is_valid: true,
  data: googlePayload
} | {
  is_valid: false
}




export async function validateGoogleJWT(header: string, env: Bindings, db: Client): Promise<response>{
  const token = parseToken(header)
  if (!token) {
    return {
      is_valid: false
    }
  }
  console.log(token)
  const googleSecret = await (await fetch("https://www.googleapis.com/oauth2/v3/certs")).json() as googleCert
  try {
    const first_verification = await jwt.verify(token, googleSecret.keys[0], "RS256")
    if (!first_verification) {
      console.log('first verification fail')
      const second_verification = await jwt.verify(token, googleSecret.keys[1], "RS256")
      if (!second_verification) {
        console.log('second verification fail')
        return {
          is_valid: false
        }
      }
    }
  } catch (e) {
    console.log(e)
    return {
      is_valid: false
    }
  }

  
  const payload = jwt.decode(token).payload as googlePayload

  if (!googleIss.includes(payload.iss)) {
    console.log('iss fail')
    return {
      is_valid: false

    }
  }
  
  // if (payload.aud != env.GOOGLE_CLIENT_ID) {
  //   console.log('aud fail')
  //   return {
  //     is_valid: false
  //   }
  // }




  return {
    is_valid: true,
    data: payload
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

