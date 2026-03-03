import { jwtVerify, SignJWT } from 'jose'

const secret = new TextEncoder().encode(process.env.TOKEN_SECRET)

export const createAccessToken = (userId: string) => {
  return new SignJWT(userId)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .setIssuedAt()
    .sign(secret)
}

export const createRefreshToken = (userId: string) => {
  return new SignJWT(userId)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .setIssuedAt()
    .sign(secret)
}

export const verifyToken = async (token: string) => {
  const { payload } = await jwtVerify(token, secret)
  return payload
}
