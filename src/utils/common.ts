import { existsSync } from 'fs'
import { resolve } from 'path'


export function envVariablesPath(dest: string) {

  const path = resolve(`${dest}/development.env`)

  if (!existsSync(path)) {
    return resolve(`${dest}/.env`)
  }

  return path
}
