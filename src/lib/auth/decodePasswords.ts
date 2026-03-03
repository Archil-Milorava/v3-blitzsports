import bcrypt from 'bcrypt'

export const decodePasswords = async (plainPassword: string, hashedPassword: string) => {
  const comparePasswords = await bcrypt.compare(plainPassword, hashedPassword)

  return comparePasswords
}
