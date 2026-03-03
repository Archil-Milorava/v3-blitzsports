import bcrypt from 'bcrypt'

export const hashPassword = async (plainPassword: string) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(plainPassword, salt)

  return hashedPassword
}
