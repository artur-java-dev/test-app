import * as bcrypt from 'bcryptjs'


export function encodePassword(password: string): string {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  return hash
}


export function isMatchPasswords(password: string, userPassword: string) {
  return bcrypt.compareSync(password, userPassword)
}
