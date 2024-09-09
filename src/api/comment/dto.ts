import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'


export class CreateCommentDto {

  @IsString()
  @MinLength(20)
  @ApiProperty({ nullable: false })
  content: string

}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
}
