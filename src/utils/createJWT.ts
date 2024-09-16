import jwt  from "@tsndr/cloudflare-worker-jwt"

interface userJWT {
  id: number,
  is_admin: boolean,
  sub: string
}

export async function createJWT(user: userJWT, env: Bindings) {
  const nbf = Math.floor(Date.now() / 1000)
  const exp =  Math.floor(Date.now() / 1000) + (2 * (60 * 60))
  const iat = Math.floor(Date.now() / 1000)
  const iss = 'https://ramosusach-api.opensourceusach.workers.dev/'
  const aud = 'https://ramosusach-api.opensourceusach.workers.dev/'
  
  const jwt_data = {
    nbf,
    exp,
    iat,
    iss,
    aud,
    ...user
  }
  
  return await jwt.sign(jwt_data, env.JWT_SECRET_KEY)
}