import { jwtVerify, SignJWT } from 'jose'

const secret = new TextEncoder().encode(process.env.TOKEN_SECRET)

export const createAccessToken = (userId: string) => {
  return new SignJWT({ userId, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('60s')
    .setIssuedAt()
    .sign(secret)
}

export const createRefreshToken = (userId: string) => {
  return new SignJWT({ userId, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .setIssuedAt()
    .sign(secret)
}

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret)
    const { userId, type, exp, iat } = payload
    return { userId, type, exp, iat }
  } catch (error) {
    return null
  }
}
