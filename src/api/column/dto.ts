import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Trim } from 'class-sanitizer'
import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator'


export class CreateColumnDto {

  @IsString()
  @MinLength(4)
  @Trim()
  @ApiProperty({ nullable: false })
  title: string

  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiPropertyOptional()
  position?: number

}

export class UpdateColumnDto extends PartialType(CreateColumnDto) {
}
