import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity } from 'typeorm'


export type EntityType = 'Column' | 'Card' | 'Comment'


export class ResponseDto<T extends BaseEntity> {

  @ApiProperty()
  success: boolean

  data: T | T[]
}
