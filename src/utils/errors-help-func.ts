import { HttpException, HttpStatus } from '@nestjs/common'

export function unexpectedError(message?: string) {
  throw new HttpException(
    message ?? 'Unexpected error',
    HttpStatus.INTERNAL_SERVER_ERROR)
}

export function badRequest(message: string) {
  throw new HttpException(message, HttpStatus.BAD_REQUEST)
}
