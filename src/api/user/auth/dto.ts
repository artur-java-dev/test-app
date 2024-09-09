import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Trim } from 'class-sanitizer'
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'


export class RegisterDto {

  @Trim()
  @IsEmail()
  @ApiProperty({ nullable: false })
  public readonly email: string

  @IsString()
  @MinLength(8)
  @ApiProperty({ nullable: false })
  public readonly password: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  public readonly name?: string

}


export class LoginDto {

  @Trim()
  @IsEmail()
  @ApiProperty({ nullable: false })
  public readonly email: string

  @IsString()
  @ApiProperty({ nullable: false })
  public readonly password: string

}
