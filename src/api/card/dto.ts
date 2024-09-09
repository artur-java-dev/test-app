import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Trim } from 'class-sanitizer'
import { IsString, MinLength } from 'class-validator'


export class CreateCardDto {

  @IsString()
  @MinLength(4)
  @Trim()
  @ApiProperty({ nullable: false })
  title: string

  @IsString()
  @MinLength(20)
  @Trim()
  @ApiProperty({ nullable: false })
  description: string

}

export class UpdateCardDto extends PartialType(CreateCardDto) {
}
